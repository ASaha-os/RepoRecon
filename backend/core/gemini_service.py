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


def clean_readme_content(readme_text: str) -> str:
    """
    Strip fluff from README to keep only valuable text for LLM analysis.
    Removes images, badges, license sections, and other non-essential content.
    
    Args:
        readme_text: Raw README content
        
    Returns:
        Cleaned README with only valuable text
    """
    text = readme_text
    
    # Remove HTML comments
    text = re.sub(r'<!--.*?-->', '', text, flags=re.DOTALL)
    
    # Remove images: ![alt](url) and <img> tags
    text = re.sub(r'!\[.*?\]\(.*?\)', '', text)
    text = re.sub(r'<img[^>]*/?>', '', text, flags=re.IGNORECASE)
    
    # Remove badges (common badge URLs)
    text = re.sub(r'\[!\[.*?\]\(.*?\)\]\(.*?\)', '', text)  # [![badge](img)](link)
    text = re.sub(r'https?://[^\s]*(?:badge|shield|img\.shields\.io|travis-ci|codecov|coveralls)[^\s\)]*', '', text, flags=re.IGNORECASE)
    
    # Remove license sections
    text = re.sub(r'#+\s*(?:License|Licence|Legal|Copyright).*?(?=\n#|\Z)', '', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'\*\*(?:License|Licence)\*\*.*?(?=\n\n|\n#|\Z)', '', text, flags=re.DOTALL | re.IGNORECASE)
    
    # Remove contributing/code of conduct sections
    text = re.sub(r'#+\s*(?:Contributing|Code of Conduct|Contributors|Acknowledgements?).*?(?=\n#|\Z)', '', text, flags=re.DOTALL | re.IGNORECASE)
    
    # Remove sponsor/donation sections
    text = re.sub(r'#+\s*(?:Sponsor|Donate|Support|Funding).*?(?=\n#|\Z)', '', text, flags=re.DOTALL | re.IGNORECASE)
    
    # Remove changelog sections
    text = re.sub(r'#+\s*(?:Changelog|Release Notes|Version History).*?(?=\n#|\Z)', '', text, flags=re.DOTALL | re.IGNORECASE)
    
    # Remove HTML tags but keep content
    text = re.sub(r'<(?:div|span|p|br|hr|table|tr|td|th|thead|tbody)[^>]*>', '', text, flags=re.IGNORECASE)
    text = re.sub(r'</(?:div|span|p|br|hr|table|tr|td|th|thead|tbody)>', '', text, flags=re.IGNORECASE)
    
    # Remove inline HTML attributes and style tags
    text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'style="[^"]*"', '', text, flags=re.IGNORECASE)
    text = re.sub(r'align="[^"]*"', '', text, flags=re.IGNORECASE)
    
    # Remove excessive links but keep link text: [text](url) -> text
    # Keep first few links, remove rest to save tokens
    link_count = 0
    def replace_link(match):
        nonlocal link_count
        link_count += 1
        if link_count <= 5:  # Keep first 5 links intact
            return match.group(0)
        return match.group(1)  # Return just the text
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', replace_link, text)
    
    # Remove empty markdown links
    text = re.sub(r'\[\]\([^\)]*\)', '', text)
    
    # Remove horizontal rules
    text = re.sub(r'\n[-*_]{3,}\n', '\n', text)
    
    # Collapse multiple blank lines to single
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # Remove leading/trailing whitespace from lines
    lines = [line.strip() for line in text.split('\n')]
    text = '\n'.join(lines)
    
    # Remove empty lines at start/end
    text = text.strip()
    
    return text


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
        'gemini-2.5-flash-lite-preview-09-2025',    # Latest experimental
             # 8B variant
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
    Parse Gemini response with error handling for hallucinations and truncation.
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
        json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
        if json_match:
            try:
                parsed = json.loads(json_match.group(1).strip())
                logger.debug('Successfully parsed JSON from markdown code block')
                return parsed
            except json.JSONDecodeError as e:
                logger.debug(f'Markdown JSON parse failed: {str(e)}')
        
        # Try finding JSON object in response - handle incomplete/truncated JSON
        first_brace = text.find('{')
        if first_brace != -1:
            json_str = text[first_brace:]
            
            # Try direct parse first
            try:
                parsed = json.loads(json_str)
                logger.debug('Successfully parsed JSON from first brace')
                return parsed
            except json.JSONDecodeError:
                pass
            
            # JSON is likely truncated - extract fields manually
            logger.info('JSON appears truncated, extracting fields manually...')
            result = _extract_fields_from_truncated_json(json_str)
            if result:
                logger.info('Successfully extracted fields from truncated JSON')
                return result
        
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


def _extract_fields_from_truncated_json(json_str: str) -> Optional[Dict[str, Any]]:
    """
    Extract fields from truncated/incomplete JSON using regex.
    
    Args:
        json_str: Potentially truncated JSON string
        
    Returns:
        Dictionary with extracted fields, or None if extraction fails
    """
    result = {}
    
    # Extract summary - handle multi-line and escaped content
    summary_match = re.search(r'"summary"\s*:\s*"((?:[^"\\]|\\.)*)"', json_str)
    if summary_match:
        result['summary'] = summary_match.group(1).replace('\\"', '"').replace('\\n', '\n')
    
    # Extract mermaid_code - handle newlines and escapes
    mermaid_match = re.search(r'"mermaid_code"\s*:\s*"((?:[^"\\]|\\.)*)"', json_str)
    if mermaid_match:
        result['mermaid_code'] = mermaid_match.group(1).replace('\\"', '"').replace('\\n', '\n')
    
    # Extract detected_issues array - handle complete and partial arrays
    issues_match = re.search(r'"detected_issues"\s*:\s*\[(.*?)(?:\]|$)', json_str, re.DOTALL)
    if issues_match:
        issues_str = issues_match.group(1)
        issues = re.findall(r'"((?:[^"\\]|\\.)*)"', issues_str)
        result['detected_issues'] = [i.replace('\\"', '"') for i in issues]
    
    # Extract fix_recommendations array - handle complete and partial arrays
    fixes_match = re.search(r'"fix_recommendations"\s*:\s*\[(.*?)(?:\]|$)', json_str, re.DOTALL)
    if fixes_match:
        fixes_str = fixes_match.group(1)
        fixes = re.findall(r'"((?:[^"\\]|\\.)*)"', fixes_str)
        result['fix_recommendations'] = [f.replace('\\"', '"') for f in fixes]
    
    # Return result if we got at least summary (the most important field)
    if 'summary' in result:
        return result
    
    return None


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
        
        # Step 2: Clean README - strip images, badges, license, etc.
        logger.debug('Cleaning README content...')
        readme_content = clean_readme_content(readme_content)
        logger.info(f'README after cleaning: {len(readme_content)} characters')
        
        # Step 3: Trim to essential content (even for short READMEs)
        max_readme_length = 1200  # Slightly higher limit since we cleaned it
        
        if len(readme_content) > max_readme_length:
            # Prioritize: title, description, features, installation, usage
            lines = readme_content.split('\n')
            essential_lines = []
            char_count = 0
            in_priority_section = True  # Start assuming we're in important content
            
            priority_headers = ['install', 'usage', 'feature', 'getting started', 'quick start', 'overview', 'about']
            skip_headers = ['faq', 'troubleshoot', 'test', 'development', 'roadmap']
            
            for line in lines:
                if char_count >= max_readme_length:
                    break
                
                line_lower = line.lower().strip()
                
                # Check if entering a priority or skip section
                if line_lower.startswith('#'):
                    header_text = line_lower.lstrip('#').strip()
                    if any(p in header_text for p in skip_headers):
                        in_priority_section = False
                        continue
                    elif any(p in header_text for p in priority_headers):
                        in_priority_section = True
                    # Always include headers (they're short)
                    essential_lines.append(line)
                    char_count += len(line) + 1
                elif in_priority_section or char_count < 400:  # Always take first 400 chars
                    essential_lines.append(line)
                    char_count += len(line) + 1
            
            readme_content = '\n'.join(essential_lines)
            # Final trim if still over
            if len(readme_content) > max_readme_length:
                readme_content = readme_content[:max_readme_length].rsplit(' ', 1)[0] + '...'
        
        logger.info(f'Final README size for API: {len(readme_content)} characters')
        
        # Step 4: Configure Gemini Flash (required for free tier - 10x higher rate limits)
        logger.debug('Configuring Gemini Flash model...')
        model = configure_gemini_model()
        
        # Step 5: Ultra-minimal prompt with explicit JSON format requirement
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
        
        # Retry logic with exponential backoff for 429 errors
        max_retries = 3
        base_delay = 30  # Start with 30 second delay
        
        for attempt in range(max_retries):
            try:
                # Use response_mime_type to force JSON output if supported
                try:
                    response = model.generate_content(
                        analysis_prompt,
                        generation_config={
                            'temperature': 0.2,  # Very low for consistent JSON
                            'max_output_tokens': 1500,  # Enough for complete JSON response
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
                            'max_output_tokens': 1500,  # Enough for complete JSON response
                            'top_p': 0.7,
                            'top_k': 15
                        }
                    )
                break  # Success, exit retry loop
                
            except Exception as e:
                error_str = str(e).lower()
                is_rate_limit = any(x in error_str for x in ['429', 'quota', 'rate limit', 'resource exhausted'])
                
                if is_rate_limit and attempt < max_retries - 1:
                    delay = base_delay * (2 ** attempt)  # Exponential backoff: 30s, 60s, 120s
                    logger.warning(f'Rate limit hit (attempt {attempt + 1}/{max_retries}). Sleeping {delay}s...')
                    time.sleep(delay)
                elif is_rate_limit:
                    raise GeminiAnalysisError(
                        f'API quota exceeded after {max_retries} attempts. '
                        f'Please wait a few minutes before trying again.'
                    )
                else:
                    # Not a rate limit error, raise immediately
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
