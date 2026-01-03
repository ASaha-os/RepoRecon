"""
REST API Views for RepoRecon Backend
Handles repository analysis requests and returns structured data
"""

import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from core.gemini_service import perform_deep_analysis, GeminiAnalysisError

logger = logging.getLogger(__name__)


@method_decorator(csrf_exempt, name='dispatch')
class AnalyzeRepoView(APIView):
    """
    API endpoint for deep repository analysis.
    
    POST /api/analyze/
    - Request body: {"github_url": "https://github.com/owner/repo"}
    - Response: {
        "success": true,
        "data": {
            "summary": "...",
            "mermaid_code": "...",
            "detected_issues": [...],
            "fix_recommendations": [...]
        }
    }
    """
    
    def post(self, request):
        """
        Handle POST request for repository analysis.
        
        Args:
            request: Django HTTP request with github_url in body
            
        Returns:
            Response with analysis results or error message
        """
        try:
            # Extract and validate GitHub URL
            github_url = request.data.get('github_url', '').strip()
            
            if not github_url:
                logger.warning('Analysis request received without github_url')
                return Response(
                    {
                        'success': False,
                        'error': 'github_url is required'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate URL format
            if not github_url.startswith(('http://', 'https://')):
                github_url = 'https://' + github_url
            
            if 'github.com' not in github_url:
                logger.warning(f'Invalid GitHub URL provided: {github_url}')
                return Response(
                    {
                        'success': False,
                        'error': 'URL must be a valid GitHub repository URL'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            logger.info(f'Starting analysis for: {github_url}')
            
            # Perform the analysis
            analysis_result = perform_deep_analysis(github_url)
            
            logger.info(f'Analysis completed successfully for: {github_url}')
            
            return Response(
                {
                    'success': True,
                    'data': analysis_result
                },
                status=status.HTTP_200_OK
            )
        
        except GeminiAnalysisError as e:
            error_msg = str(e)
            logger.error(f'Gemini analysis error: {error_msg}')
            return Response(
                {
                    'success': False,
                    'error': error_msg
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        except Exception as e:
            error_msg = f'Unexpected server error: {str(e)}'
            logger.error(error_msg)
            return Response(
                {
                    'success': False,
                    'error': 'An unexpected error occurred during analysis'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class RootView(APIView):
    """Welcome endpoint with API documentation"""
    
    def get(self, request):
        """Return API information"""
        return Response(
            {
                'message': 'Welcome to RepoRecon API',
                'version': '1.0',
                'endpoints': {
                    'health': '/api/health/',
                    'analyze': '/api/analyze/ (POST)',
                },
                'documentation': {
                    'analyze_description': 'Deep repository architectural analysis using Gemini 1.5 Pro',
                    'analyze_body': {'github_url': 'https://github.com/owner/repo'},
                    'analyze_response': {
                        'success': True,
                        'data': {
                            'summary': 'Architecture summary',
                            'mermaid_code': 'sequenceDiagram...',
                            'detected_issues': ['issue1', 'issue2'],
                            'fix_recommendations': ['recommendation1']
                        }
                    }
                }
            },
            status=status.HTTP_200_OK
        )


class HealthCheckView(APIView):
    """Simple health check endpoint for monitoring"""
    
    def get(self, request):
        """Return service status"""
        return Response(
            {
                'status': 'ok',
                'service': 'RepoRecon Backend'
            },
            status=status.HTTP_200_OK
        )
