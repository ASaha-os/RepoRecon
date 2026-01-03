#!/bin/bash
# Security Check Script for RepoRecon
# Verifies that no sensitive files are tracked by git

echo "🔒 RepoRecon Security Check"
echo "============================"
echo ""

# Check for tracked .env files (except .env.example)
echo "📋 Checking for tracked .env files..."
TRACKED_ENV=$(git ls-files | grep -E "\.env($|\.)" | grep -v ".env.example")

if [ -z "$TRACKED_ENV" ]; then
    echo "✅ No sensitive .env files are tracked by git"
else
    echo "❌ WARNING: The following .env files are tracked:"
    echo "$TRACKED_ENV"
    echo ""
    echo "To remove them from git (but keep locally):"
    echo "git rm --cached <filename>"
fi

echo ""

# Check for .env files in working directory
echo "📁 Checking for .env files in working directory..."
find . -name ".env*" -type f | grep -v ".env.example" | grep -v "node_modules" | grep -v ".git"

echo ""
echo "✅ Security check complete!"
echo ""
echo "Remember:"
echo "- Never commit .env files with sensitive data"
echo "- Always use .env.example as a template"
echo "- Keep API keys and secrets in environment variables"
