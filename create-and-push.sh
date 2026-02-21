#!/bin/bash

# Create GitHub repo and push - Interactive
set -e

PROJECT_DIR="/home/noman-mahmud/Noman/New Try Ramadan"
cd "$PROJECT_DIR"

GITHUB_USER="official-noman"
REPO_NAME="noor-e-ramadan"

echo "🚀 Creating GitHub Repository and Pushing..."
echo "============================================="
echo ""
echo "GitHub Username: $GITHUB_USER"
echo "Repository Name: $REPO_NAME"
echo ""

# Remove existing remote if any
git remote remove origin 2>/dev/null || true

# Set remote
GITHUB_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"
echo "📦 Setting remote: $GITHUB_URL"
git remote add origin "$GITHUB_URL" 2>/dev/null || {
    echo "⚠️  Remote might already exist, continuing..."
}

echo ""
echo "📤 Ready to push!"
echo ""
echo "⚠️  IMPORTANT: You need to create the repository on GitHub first:"
echo ""
echo "1. Go to: https://github.com/new"
echo "2. Repository name: $REPO_NAME"
echo "3. Make it Public or Private"
echo "4. DO NOT initialize with README, .gitignore, or license"
echo "5. Click 'Create repository'"
echo ""
echo "Then run this command to push:"
echo "   git push -u origin main"
echo ""
echo "Or if you want me to try pushing now (will fail if repo doesn't exist):"
read -p "Try to push now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📤 Attempting to push..."
    git push -u origin main 2>&1 || {
        echo ""
        echo "❌ Push failed. This is normal if the repository doesn't exist yet."
        echo "   Please create the repository on GitHub first, then run:"
        echo "   git push -u origin main"
    }
else
    echo "✅ Remote configured. Push when ready with: git push -u origin main"
fi

echo ""
echo "✅ Setup complete!"
echo "🔗 Repository URL: $GITHUB_URL"
