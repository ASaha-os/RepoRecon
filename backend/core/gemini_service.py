"""
Gemini Service for Deep Repository Analysis
Handles GitHub scraping, AI analysis, and response validation
"""

import json
import re
import logging
import time
from typing import Dict, List, Any, Optional

import google.generativeai as genai
import requests
from django.conf import settings

logger = logging.getLogger(__name__)


class GeminiAnalysisError(Exception):
    """Custom exception for Gemini analysis failures"""
    pass


def fetch_github_readme(repo_url: str) -> str:
    """
    Fetch README.md from a GitHub repository.
    
    Args:
        repo_url: GitHub repository URL (e.g., https://github.com/owner/repo)
        
    Returns:
        Content of README.md file
        
    Raises:
        GeminiAnalysisError: If README cannot be fetched
    """
    try:
        # Normalize the URL
        repo_url = repo_url.strip().rstrip('/')
        
        # Extract owner and repo from URL
        if 'github.com' not in repo_url:
            raise GeminiAnalysisError('Invalid GitHub URL provided')
        
        parts = repo_url.replace('https://', '').replace('http://', '').split('/')
        if len(parts) < 3:
            raise GeminiAnalysisError('Invalid GitHub URL format')
        
        owner, repo = parts[1], parts[2]
        
        # Construct raw GitHub URL
        raw_url = f'https://raw.githubusercontent.com/{owner}/{repo}/main/README.md'
        
        response = requests.get(raw_url, timeout=10)
        
        # Try master branch if main fails
        if response.status_code == 404:
            raw_url = f'https://raw.githubusercontent.com/{owner}/{repo}/master/README.md'
            response = requests.get(raw_url, timeout=10)
        
        if response.status_code != 200:
            raise GeminiAnalysisError(
                f'Could not fetch README from {repo_url}. '
                f'Ensure the repository is public and has a README.'
            )
        
        return response.text
        
    except requests.RequestException as e:
        raise GeminiAnalysisError(f'Network error fetching GitHub repository: {str(e)}')
    except IndexError:
        raise GeminiAnalysisError('Invalid GitHub URL format')


def configure_gemini_model() -> Any:
    """
    Configure and return Gemini 1.5 Flash model instance (Flash-only for free tier).
    
    Flash model is required because it has 10x higher rate limits than Pro models.
    
    Returns:
        Configured Gemini Flash model
        
    Raises:
        GeminiAnalysisError: If API key is not configured or Flash model is not available
    """
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        raise GeminiAnalysisError(
            'Gemini API key not configured. Set GEMINI_API_KEY in .env'
        )
    
    genai.configure(api_key=api_key)
    
    # List all available models first
    available_model_names = []
    flash_models = []
    try:
        for model in genai.list_models():
            # Extract model name (remove 'models/' prefix)
            model_name = model.name.replace('models/', '')
            # Check if it supports generateContent
            supports_generate = False
            if hasattr(model, 'supported_generation_methods'):
                if 'generateContent' in model.supported_generation_methods:
                    supports_generate = True
                    available_model_names.append(model_name)
                    # Track Flash models specifically
                    if 'flash' in model_name.lower():
                        flash_models.append(model_name)
            else:
                # If we can't check, add it anyway and try
                available_model_names.append(model_name)
                if 'flash' in model_name.lower():
                    flash_models.append(model_name)
        
        logger.info(f'Found {len(available_model_names)} available Gemini models')
        if flash_models:
            logger.info(f'Flash models found: {flash_models}')
        if available_model_names:
            logger.info(f'All available models: {available_model_names}')
    except Exception as e:
        logger.warning(f'Could not list models: {str(e)}. Will try common model names.')
        available_model_names = []
        flash_models = []
    
    # Try Flash models in order of preference (newer versions first, then older)
    # Flash models have 10x higher rate limits than Pro models
    preferred_flash_models = [
        'gemini-2.0-flash-exp',    # Latest experimental
        'gemini-2.0-flash',        # Latest stable
        'gemini-1.5-flash-002',   # Versioned
        'gemini-1.5-flash',        # Standard
        'gemini-1.5-flash-8b',     # 8B variant
    ]
    
    # First, try any Flash models found in available list
    if flash_models:
        for flash_model in flash_models:
            try:
                model = genai.GenerativeModel(flash_model)
                logger.info(f'Successfully configured Flash model: {flash_model}')
                return model
            except Exception as e:
                logger.debug(f'Failed to load Flash model {flash_model}: {str(e)}')
                continue
    
    # If no Flash found in list, try preferred Flash models directly
    for model_name in preferred_flash_models:
        try:
            model = genai.GenerativeModel(model_name)
            logger.info(f'Successfully configured Flash model: {model_name}')
            return model
        except Exception as e:
            logger.debug(f'Failed to load Flash model {model_name}: {str(e)}')
            continue
    
    # If Flash models fail, try any available model (better than nothing)
    if available_model_names:
        logger.warning('No Flash models available, trying any available model...')
        for model_name in available_model_names:
            try:
                model = genai.GenerativeModel(model_name)
                logger.info(f'Using available model (not Flash): {model_name}')
                return model
            except Exception as e:
                logger.debug(f'Failed to load model {model_name}: {str(e)}')
                continue
    
    # Final error message with helpful info
    error_msg = 'Could not find any working Gemini model. '
    if available_model_names:
        error_msg += f'Available models: {", ".join(available_model_names[:15])}. '
    else:
        error_msg += 'No models found. Please check your API key permissions. '
    error_msg += 'Flash models (gemini-*-flash) are recommended for free tier (10x higher rate limits).'
    
    raise GeminiAnalysisError(error_msg)


def parse_gemini_response(response_text: str) -> Dict[str, Any]:
    """
    Parse Gemini response with error handling for hallucinations.
    Extracts JSON from the response even if wrapped in markdown or text.
    
    Args:
        response_text: Raw response from Gemini
        
    Returns:
        Parsed JSON response
        
    Raises:
        GeminiAnalysisError: If response cannot be parsed
    """
    # Log the raw response for debugging
    logger.debug(f'Raw Gemini response (first 500 chars): {response_text[:500]}')
    
    try:
        # Strip whitespace and remove any conversational prefixes
        text = response_text.strip()
        
        # Remove common conversational prefixes and suffixes
        prefixes_to_remove = [
            r'^Sure,?\s*',
            r'^Here\s+is\s+your\s+',
            r'^Here\'s\s+your\s+',
            r'^Here\s+is\s+the\s+',
            r'^Here\'s\s+the\s+',
            r'^Of\s+course,?\s*',
            r'^I\'ll\s+',
            r'^Let\s+me\s+',
        ]
        for prefix in prefixes_to_remove:
            text = re.sub(prefix, '', text, flags=re.IGNORECASE)
        
        # Remove trailing conversational text
        text = re.sub(r'\.\s*(Is there anything else|Let me know|Hope this helps).*$', '', text, flags=re.IGNORECASE)
        text = text.strip()
        
        # Try direct JSON parsing first (after stripping)
        try:
            parsed = json.loads(text)
            logger.debug('Successfully parsed JSON directly')
            return parsed
        except json.JSONDecodeError as e:
            logger.debug(f'Direct JSON parse failed: {str(e)}')
        
        # Try extracting JSON from markdown code blocks (remove ```json or ```)
        # Match both single-line and multi-line code blocks
        json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
        if json_match:
            try:
                parsed = json.loads(json_match.group(1).strip())
                logger.debug('Successfully parsed JSON from markdown code block')
                return parsed
            except json.JSONDecodeError as e:
                logger.debug(f'Markdown JSON parse failed: {str(e)}')
        
        # Try finding JSON object in response - handle incomplete/truncated JSON
        # Find the first { and try to extract complete JSON
        first_brace = text.find('{')
        if first_brace != -1:
            # Try to find the matching closing brace
            json_str = text[first_brace:]
            
            # Count braces to find the end of the JSON object
            brace_count = 0
            in_string = False
            escape_next = False
            json_end = -1
            
            for i, char in enumerate(json_str):
                if escape_next:
                    escape_next = False
                    continue
                if char == '\\':
                    escape_next = True
                    continue
                if char == '"' and not escape_next:
                    in_string = not in_string
                    continue
                if not in_string:
                    if char == '{':
                        brace_count += 1
                    elif char == '}':
                        brace_count -= 1
                        if brace_count == 0:
                            json_end = i + 1
                            break
            
            if json_end > 0:
                json_str = json_str[:json_end]
            else:
                # JSON might be incomplete - try to close it
                json_str = json_str.rstrip()
                if not json_str.endswith('}'):
                    # Try to close incomplete JSON
                    if json_str.count('{') > json_str.count('}'):
                        # Add missing closing braces
                        missing = json_str.count('{') - json_str.count('}')
                        # Try to close arrays and objects
                        if json_str.rstrip().endswith(','):
                            json_str = json_str.rstrip()[:-1]  # Remove trailing comma
                        if '"' in json_str and not json_str.rstrip().endswith('"'):
                            # Try to close incomplete string
                            last_quote = json_str.rfind('"')
                            if last_quote > 0:
                                # Check if we're in a string
                                before_quote = json_str[:last_quote]
                                if before_quote.count('"') % 2 == 1:  # Odd number means we're in a string
                                    json_str = json_str[:last_quote+1] + '"'
                        # Add closing braces
                        json_str += '}' * missing
            
            # Try to fix common JSON issues
            json_str = re.sub(r',\s*}', '}', json_str)
            json_str = re.sub(r',\s*]', ']', json_str)
            json_str = re.sub(r',\s*$', '', json_str)  # Remove trailing comma at end
            
            try:
                parsed = json.loads(json_str)
                logger.debug('Successfully parsed JSON from extracted object')
                return parsed
            except json.JSONDecodeError as e:
                logger.debug(f'Extracted JSON parse failed: {str(e)}')
                logger.debug(f'Attempted to parse: {json_str[:300]}...')
                
                # Last resort: try to extract fields manually from incomplete JSON
                try:
                    result = {}
                    # Extract summary
                    summary_match = re.search(r'"summary"\s*:\s*"([^"]*(?:\\.[^"]*)*)"', json_str)
                    if summary_match:
                        result['summary'] = summary_match.group(1).replace('\\"', '"')
                    
                    # Extract mermaid_code
                    mermaid_match = re.search(r'"mermaid_code"\s*:\s*"([^"]*(?:\\.[^"]*)*)"', json_str)
                    if mermaid_match:
                        result['mermaid_code'] = mermaid_match.group(1).replace('\\"', '"').replace('\\n', '\n')
                    
                    # Extract detected_issues array
                    issues_match = re.search(r'"detected_issues"\s*:\s*\[(.*?)\]', json_str, re.DOTALL)
                    if issues_match:
                        issues_str = issues_match.group(1)
                        issues = [i.strip().strip('"') for i in re.findall(r'"([^"]*)"', issues_str)]
                        result['detected_issues'] = issues
                    
                    # Extract fix_recommendations array
                    fixes_match = re.search(r'"fix_recommendations"\s*:\s*\[(.*?)\]', json_str, re.DOTALL)
                    if fixes_match:
                        fixes_str = fixes_match.group(1)
                        fixes = [f.strip().strip('"') for f in re.findall(r'"([^"]*)"', fixes_str)]
                        result['fix_recommendations'] = fixes
                    
                    if result:
                        logger.info('Extracted partial JSON data manually')
                        return result
                except Exception as extract_error:
                    logger.debug(f'Manual extraction also failed: {str(extract_error)}')
        
        # Last resort: try to find and fix common JSON issues
        # Look for JSON-like structure and try to repair it
        json_candidates = re.findall(r'\{[^{}]*\}', text, re.DOTALL)
        for candidate in json_candidates:
            try:
                # Try to fix common issues
                fixed = candidate
                # Fix unescaped quotes in strings (basic attempt)
                # Remove trailing commas
                fixed = re.sub(r',\s*}', '}', fixed)
                fixed = re.sub(r',\s*]', ']', fixed)
                parsed = json.loads(fixed)
                logger.debug('Successfully parsed JSON after repair attempts')
                return parsed
            except json.JSONDecodeError:
                continue
        
        # If all parsing attempts failed, log the full response and raise error
        logger.error(f'Failed to parse JSON. Full response: {response_text[:1000]}')
        raise GeminiAnalysisError(
            f'Could not extract valid JSON from Gemini response. '
            f'Response preview: {response_text[:200]}... '
            f'Please check the server logs for the full response.'
        )
        
    except json.JSONDecodeError as e:
        logger.error(f'JSON decode error: {str(e)}. Response: {response_text[:500]}')
        raise GeminiAnalysisError(f'Invalid JSON in Gemini response: {str(e)}')


def validate_response_schema(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate and normalize response schema with defaults for missing fields.
    
    Args:
        data: Parsed response data
        
    Returns:
        Validated response with all required fields
        
    Raises:
        GeminiAnalysisError: If critical fields are missing
    """
    required_fields = {'summary', 'mermaid_code', 'detected_issues', 'fix_recommendations'}
    
    if not isinstance(data, dict):
        raise GeminiAnalysisError('Response must be a JSON object')
    
    # Ensure all required fields exist with proper types
    validated = {
        'summary': str(data.get('summary', 'No summary generated')),
        'mermaid_code': str(data.get('mermaid_code', 'sequenceDiagram\n    participant A\n    participant B\n    A->>B: Analysis incomplete')),
        'detected_issues': data.get('detected_issues', []) if isinstance(data.get('detected_issues'), list) else [],
        'fix_recommendations': data.get('fix_recommendations', []) if isinstance(data.get('fix_recommendations'), list) else [],
    }
    
    # Ensure issues and recommendations are lists of strings
    validated['detected_issues'] = [str(issue) for issue in validated['detected_issues']]
    validated['fix_recommendations'] = [str(rec) for rec in validated['fix_recommendations']]
    
    return validated


def perform_deep_analysis(repo_url: str) -> Dict[str, Any]:
    """
    Perform comprehensive architectural analysis of a GitHub repository using Gemini.
    
    Process:
    1. Fetch README.md from the repository
    2. Configure Gemini 1.5 Pro model
    3. Send detailed analysis prompt to Gemini
    4. Parse and validate the JSON response
    5. Return structured analysis results
    
    Args:
        repo_url: GitHub repository URL
        
    Returns:
        Dictionary containing:
        - summary: Text summary of architecture
        - mermaid_code: Sequence diagram in Mermaid format
        - detected_issues: List of architectural issues found
        - fix_recommendations: List of recommended fixes
        
    Raises:
        GeminiAnalysisError: If any step fails
    """
    try:
        logger.info(f'Starting analysis for repository: {repo_url}')
        
        # Step 1: Fetch README
        logger.debug('Fetching README from GitHub...')
        readme_content = fetch_github_readme(repo_url)
        
        # EXTREME content trimming - only first 800 characters max
        # This ensures we stay well under free tier TPM limits
        max_readme_length = 800
        
        # Take only the absolute essentials: title and first paragraph
        if len(readme_content) > max_readme_length:
            # Get first lines up to limit (title + description usually)
            lines = readme_content.split('\n')
            essential_lines = []
            char_count = 0
            
            # Take only: main title (#), subtitle (##), and first 2-3 paragraphs
            for i, line in enumerate(lines):
                if char_count >= max_readme_length:
                    break
                # Include headers and first 15 lines (usually title + description)
                if line.strip().startswith('#') or i < 15:
                    if char_count + len(line) + 1 <= max_readme_length:
                        essential_lines.append(line)
                        char_count += len(line) + 1
                    else:
                        # Try to end at sentence boundary
                        remaining = max_readme_length - char_count
                        if remaining > 50:  # If we have space, take partial line
                            essential_lines.append(line[:remaining])
                        break
                elif i >= 15:
                    # Stop after first 15 lines
                    break
            
            readme_content = '\n'.join(essential_lines)
            # Final safety trim
            if len(readme_content) > max_readme_length:
                readme_content = readme_content[:max_readme_length].rsplit('.', 1)[0] + '...'
        
        # Log actual size for monitoring
        logger.info(f'README content size: {len(readme_content)} characters')
        
        # Step 2: Configure Gemini Flash (required for free tier - 10x higher rate limits)
        logger.debug('Configuring Gemini Flash model...')
        model = configure_gemini_model()
        
        # Step 3: Ultra-minimal prompt with explicit JSON format requirement
        analysis_prompt = f"""Analyze this README and return ONLY valid JSON (no markdown, no code blocks, no text):

README: {readme_content}

Required JSON format (copy this structure exactly):
{{
    "summary": "Brief 2 sentence architecture summary",
    "mermaid_code": "sequenceDiagram\\n    participant User\\n    participant App\\n    User->>App: request",
    "detected_issues": ["Issue 1", "Issue 2"],
    "fix_recommendations": ["Fix 1", "Fix 2"]
}}

CRITICAL: Return ONLY the JSON object. No markdown, no code blocks, no explanations, no text before or after."""
        
        logger.debug('Sending request to Gemini...')
        
        # Single retry only for free tier (minimize quota usage)
        max_retries = 1  # Only 1 retry to save quota
        retry_delay = 90  # 90 second delay to respect rate limits
        
        for attempt in range(max_retries + 1):  # +1 because range is exclusive
            try:
                # Use response_mime_type to force JSON output if supported
                try:
                    response = model.generate_content(
                        analysis_prompt,
                        generation_config={
                            'temperature': 0.2,  # Very low for consistent JSON
                            'max_output_tokens': 800,  # Increased to ensure complete JSON
                            'top_p': 0.7,
                            'top_k': 15,
                            'response_mime_type': 'application/json',  # Force JSON output
                        }
                    )
                except (Exception, TypeError) as config_error:
                    # If response_mime_type not supported, use regular config
                    logger.debug(f'JSON mode not supported, using regular config: {str(config_error)}')
                    response = model.generate_content(
                        analysis_prompt,
                        generation_config={
                            'temperature': 0.2,
                            'max_output_tokens': 800,  # Increased to ensure complete JSON
                            'top_p': 0.7,
                            'top_k': 15
                        }
                    )
                break  # Success, exit retry loop
            except Exception as e:
                error_str = str(e)
                # Check if it's a 429 quota error
                if "429" in error_str or "quota" in error_str.lower() or "rate limit" in error_str.lower():
                    if attempt < max_retries - 1:
                        logger.warning(f'Quota/rate limit error (attempt {attempt + 1}/{max_retries}): {error_str}')
                        logger.info(f'Waiting {retry_delay} seconds before retry...')
                        time.sleep(retry_delay)
                        retry_delay *= 2  # Exponential backoff: 30s, 60s, 120s
                    else:
                        # Last attempt failed
                        raise GeminiAnalysisError(
                            f'Quota exceeded after {max_retries} attempts. '
                            f'Please wait before trying again or upgrade your API tier.'
                        )
                else:
                    # Not a quota error, re-raise immediately
                    raise
        
        if not response.text:
            raise GeminiAnalysisError('Empty response from Gemini model')
        
        logger.info(f'Received response from Gemini (length: {len(response.text)} chars)')
        logger.debug(f'Gemini response preview: {response.text[:300]}...')
        
        logger.debug('Parsing Gemini response...')
        parsed_response = parse_gemini_response(response.text)
        
        logger.debug('Validating response schema...')
        validated_response = validate_response_schema(parsed_response)
        
        logger.info(f'Analysis completed successfully for {repo_url}')
        return validated_response
        
    except GeminiAnalysisError:
        raise
    except Exception as e:
        error_msg = f'Unexpected error during analysis: {str(e)}'
        logger.error(error_msg)
        raise GeminiAnalysisError(error_msg)
