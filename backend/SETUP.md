# RepoRecon Backend Setup Guide

## Quick Start

### 1. Create Virtual Environment
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment
```bash
# Copy the example .env file
cp .env.example .env

# Edit .env and add your Gemini API key
# GEMINI_API_KEY=your-api-key-here
```

### 4. Initialize Database
```bash
python manage.py migrate
```

### 5. Run Development Server
```bash
python manage.py runserver 0.0.0.0:8000
```

The backend will be available at `http://localhost:8000`

## API Endpoints

### Health Check
```
GET /api/health/
```
Returns: `{"status": "ok", "service": "RepoRecon Backend"}`

### Analyze Repository
```
POST /api/analyze/
Content-Type: application/json

{
    "github_url": "https://github.com/owner/repo"
}
```

Response on success:
```json
{
    "success": true,
    "data": {
        "summary": "Project architecture summary...",
        "mermaid_code": "sequenceDiagram...",
        "detected_issues": ["Issue 1", "Issue 2"],
        "fix_recommendations": ["Fix 1", "Fix 2"]
    }
}
```

Response on error:
```json
{
    "success": false,
    "error": "Error message describing what went wrong"
}
```

## Architecture

### Core Files

- **settings.py**: Django configuration with CORS and .env support
- **gemini_service.py**: Gemini API integration with error handling
  - `perform_deep_analysis()`: Main analysis function
  - `fetch_github_readme()`: GitHub scraping
  - `configure_gemini_model()`: Gemini model setup
  - `parse_gemini_response()`: Response parsing with hallucination detection
  - `validate_response_schema()`: Response validation

- **views.py**: REST API endpoints
  - `AnalyzeRepoView`: Main analysis endpoint (POST /api/analyze/)
  - `HealthCheckView`: Service status check

- **urls.py**: URL routing configuration

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
DEBUG=True                                      # Set to False in production
SECRET_KEY=your-secret-key-here               # Change in production
ALLOWED_HOSTS=localhost,127.0.0.1             # Add your domain in production
GEMINI_API_KEY=your-gemini-api-key-here       # Required - get from Google AI
CORS_ALLOWED_ORIGINS=http://localhost:5173   # Frontend URL
```

## Key Features

✅ **Modular Design**: Clean separation between service layer and API views
✅ **Error Handling**: Comprehensive error handling for GitHub and Gemini failures
✅ **Hallucination Detection**: Robust JSON parsing from Gemini responses
✅ **CORS Enabled**: Ready for frontend integration
✅ **Logging**: Debug logging for troubleshooting
✅ **Hackathon-Ready**: No complex DB models, all in-memory/functional

## Testing the API

### Using cURL
```bash
curl -X POST http://localhost:8000/api/analyze/ \
  -H "Content-Type: application/json" \
  -d '{"github_url": "https://github.com/django/django"}'
```

### Using Python
```python
import requests

response = requests.post(
    'http://localhost:8000/api/analyze/',
    json={'github_url': 'https://github.com/django/django'}
)
print(response.json())
```

## Troubleshooting

**"GEMINI_API_KEY not configured"**
- Add `GEMINI_API_KEY` to your `.env` file
- Restart the development server

**"Could not fetch README from repository"**
- Ensure the repository is public
- Verify the URL is correct and follows GitHub format
- Check that the repository has a README.md file

**"Invalid JSON in Gemini response"**
- This usually indicates a temporary API issue
- Try again - the model sometimes needs retry

## Production Notes

Before deploying:
1. Set `DEBUG=False` in .env
2. Generate a strong `SECRET_KEY`
3. Configure `ALLOWED_HOSTS` with your domain
4. Update `CORS_ALLOWED_ORIGINS` with your frontend domain
5. Consider using PostgreSQL instead of SQLite
6. Use environment-specific settings for sensitive data
