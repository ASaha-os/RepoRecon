"""
Gemini Service for Deep Repository Analysis
Uses google-genai SDK with automatic model fallback.
"""

import json
import re
import logging
import time
from typing import Dict, Any, Optional

from google import genai
from google.genai import types
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

# Models tried in order — first one that works wins.
# gemini-2.5-flash is the sweet spot: free tier, fast, handles JSON well.
MODELS = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
]


class GeminiAnalysisError(Exception):
    pass


# ── README helpers ────────────────────────────────────────────────────────────

def clean_readme_content(text: str) -> str:
    """Strip badges, images, license sections and other noise."""
    text = re.sub(r'<!--.*?-->', '', text, flags=re.DOTALL)
    text = re.sub(r'!\[.*?\]\(.*?\)', '', text)
    text = re.sub(r'<img[^>]*/?>', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\[!\[.*?\]\(.*?\)\]\(.*?\)', '', text)
    text = re.sub(r'https?://[^\s]*(?:badge|shield|img\.shields\.io)[^\s\)]*', '', text, flags=re.IGNORECASE)
    for section in ['License', 'Licence', 'Contributing', 'Code of Conduct',
                    'Sponsor', 'Donate', 'Changelog', 'Release Notes']:
        text = re.sub(rf'#+\s*{section}.*?(?=\n#|\Z)', '', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL | re.IGNORECASE)
    link_count = 0
    def keep_link(m):
        nonlocal link_count
        link_count += 1
        return m.group(0) if link_count <= 5 else m.group(1)
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', keep_link, text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return '\n'.join(l.strip() for l in text.split('\n')).strip()


def trim_readme(text: str, max_len: int = 1200) -> str:
    """Keep the most useful sections within token budget."""
    if len(text) <= max_len:
        return text
    priority = ['install', 'usage', 'feature', 'getting started', 'quick start', 'overview', 'about']
    skip = ['faq', 'troubleshoot', 'test', 'development', 'roadmap']
    kept, count, in_priority = [], 0, True
    for line in text.split('\n'):
        if count >= max_len:
            break
        lower = line.lower().strip()
        if lower.startswith('#'):
            header = lower.lstrip('#').strip()
            if any(s in header for s in skip):
                in_priority = False
                continue
            if any(p in header for p in priority):
                in_priority = True
            kept.append(line)
            count += len(line) + 1
        elif in_priority or count < 400:
            kept.append(line)
            count += len(line) + 1
    result = '\n'.join(kept)
    if len(result) > max_len:
        result = result[:max_len].rsplit(' ', 1)[0] + '...'
    return result


def fetch_github_readme(repo_url: str) -> str:
    """Fetch README.md from a public GitHub repository."""
    repo_url = repo_url.strip().rstrip('/')
    if 'github.com' not in repo_url:
        raise GeminiAnalysisError('Invalid GitHub URL provided')
    parts = repo_url.replace('https://', '').replace('http://', '').split('/')
    if len(parts) < 3:
        raise GeminiAnalysisError('Invalid GitHub URL format')
    owner, repo = parts[1], parts[2]
    for branch in ('main', 'master'):
        try:
            r = requests.get(
                f'https://raw.githubusercontent.com/{owner}/{repo}/{branch}/README.md',
                timeout=10
            )
            if r.status_code == 200:
                return r.text
        except requests.RequestException:
            pass
    raise GeminiAnalysisError(
        f'Could not fetch README from {repo_url}. '
        'Ensure the repository is public and has a README.md.'
    )


# ── Response parsing ──────────────────────────────────────────────────────────

def parse_gemini_response(response_text: str) -> Dict[str, Any]:
    text = response_text.strip()
    for prefix in [r'^Sure,?\s*', r'^Here\s+is\s+', r"^Here's\s+", r'^Of\s+course,?\s*']:
        text = re.sub(prefix, '', text, flags=re.IGNORECASE)
    text = text.strip()

    # Direct parse
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Strip markdown fences
    m = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
    if m:
        try:
            return json.loads(m.group(1).strip())
        except json.JSONDecodeError:
            pass

    # Find first brace
    idx = text.find('{')
    if idx != -1:
        try:
            return json.loads(text[idx:])
        except json.JSONDecodeError:
            pass
        result = _extract_truncated(text[idx:])
        if result:
            return result

    raise GeminiAnalysisError(f'Could not parse JSON from response. Preview: {response_text[:200]}')


def _extract_truncated(s: str) -> Optional[Dict[str, Any]]:
    result = {}
    for field in ('summary', 'mermaid_code'):
        m = re.search(rf'"{field}"\s*:\s*"((?:[^"\\]|\\.)*)"', s)
        if m:
            result[field] = m.group(1).replace('\\"', '"').replace('\\n', '\n')
    for field in ('detected_issues', 'fix_recommendations'):
        m = re.search(rf'"{field}"\s*:\s*\[(.*?)(?:\]|$)', s, re.DOTALL)
        if m:
            result[field] = [i.replace('\\"', '"') for i in re.findall(r'"((?:[^"\\]|\\.)*)"', m.group(1))]
    return result if 'summary' in result else None


def validate_response_schema(data: Dict[str, Any]) -> Dict[str, Any]:
    if not isinstance(data, dict):
        raise GeminiAnalysisError('Response must be a JSON object')
    return {
        'summary': str(data.get('summary', 'No summary generated')),
        'mermaid_code': str(data.get('mermaid_code',
            'sequenceDiagram\n    participant User\n    participant App\n    User->>App: request')),
        'detected_issues': [str(i) for i in data.get('detected_issues', [])]
            if isinstance(data.get('detected_issues'), list) else [],
        'fix_recommendations': [str(r) for r in data.get('fix_recommendations', [])]
            if isinstance(data.get('fix_recommendations'), list) else [],
    }


# ── Main analysis ─────────────────────────────────────────────────────────────

def _call_gemini(client: genai.Client, prompt: str) -> str:
    """
    Try each model in MODELS order.
    On 429/quota skip to next model. On 404 skip to next model.
    Raises GeminiAnalysisError if all models fail.
    """
    last_error = None
    for model in MODELS:
        logger.info(f'Trying model: {model}')
        for attempt in range(2):  # 1 retry per model on rate limit
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        temperature=0.2,
                        max_output_tokens=1500,
                        top_p=0.8,
                        response_mime_type='application/json',
                    ),
                )
                logger.info(f'Success with model: {model}')
                return response.text
            except Exception as e:
                err_str = str(e)
                err_lower = err_str.lower()
                is_quota = any(x in err_lower for x in ['429', 'quota', 'resource_exhausted', 'resource exhausted'])
                is_not_found = '404' in err_str or 'not_found' in err_lower or 'not found' in err_lower

                if is_not_found:
                    logger.warning(f'Model {model} not found, trying next.')
                    last_error = err_str
                    break  # skip to next model immediately

                if is_quota and attempt == 0:
                    logger.warning(f'Quota hit on {model}, waiting 15s before retry...')
                    time.sleep(15)
                    continue  # retry same model once

                if is_quota:
                    logger.warning(f'Quota exhausted on {model}, trying next model.')
                    last_error = f'Quota exhausted for {model}'
                    break  # skip to next model

                # Any other error — raise immediately
                raise GeminiAnalysisError(f'Gemini API error: {err_str}')

    raise GeminiAnalysisError(
        f'All models exhausted. Last error: {last_error}. '
        'Your free tier quota may be used up — wait a few minutes or check '
        'https://ai.dev/rate-limit for your usage.'
    )


def perform_deep_analysis(repo_url: str) -> Dict[str, Any]:
    """
    Full pipeline:
      1. Fetch & clean README
      2. Call Gemini (with model fallback)
      3. Parse & validate JSON response
    """
    try:
        logger.info(f'Starting analysis for: {repo_url}')

        readme_content = trim_readme(clean_readme_content(fetch_github_readme(repo_url)))
        logger.info(f'README size after processing: {len(readme_content)} chars')

        api_key = settings.GEMINI_API_KEY
        if not api_key:
            raise GeminiAnalysisError(
                'Gemini API key not configured. Add GEMINI_API_KEY to backend/.env'
            )

        client = genai.Client(api_key=api_key)

        prompt = f"""Analyze this README and return ONLY valid JSON (no markdown, no code blocks):

README:
{readme_content}

Return exactly this JSON structure:
{{
    "summary": "2 sentence architecture summary",
    "mermaid_code": "sequenceDiagram\\n    participant User\\n    participant App\\n    User->>App: request\\n    App-->>User: response",
    "detected_issues": ["Issue 1", "Issue 2"],
    "fix_recommendations": ["Fix 1", "Fix 2"]
}}

CRITICAL: Return ONLY the JSON object. Nothing else."""

        raw = _call_gemini(client, prompt)

        if not raw:
            raise GeminiAnalysisError('Empty response from Gemini')

        logger.info(f'Response length: {len(raw)} chars')
        return validate_response_schema(parse_gemini_response(raw))

    except GeminiAnalysisError:
        raise
    except Exception as e:
        raise GeminiAnalysisError(f'Unexpected error during analysis: {str(e)}')
