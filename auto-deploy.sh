#!/bin/bash

# Auto-Deploy Script for Noor-e-Ramadan
set -e

echo "🚀 Starting Auto-Deployment Process..."
echo "========================================"

PROJECT_DIR="/home/noman-mahmud/Noman/New Try Ramadan"
cd "$PROJECT_DIR"

# Check if GitHub CLI is installed
if command -v gh &> /dev/null; then
    echo "✅ GitHub CLI found"
    
    # Check if user is logged in
    if gh auth status &> /dev/null; then
        echo "✅ GitHub CLI authenticated"
        
        # Get GitHub username
        GITHUB_USER=$(gh api user -q .login 2>/dev/null || echo "")
        
        if [ -n "$GITHUB_USER" ]; then
            echo "📦 Creating GitHub repository..."
            REPO_NAME="noor-e-ramadan"
            
            # Check if repo already exists
            if gh repo view "$GITHUB_USER/$REPO_NAME" &> /dev/null; then
                echo "⚠️  Repository already exists: $GITHUB_USER/$REPO_NAME"
                echo "   Using existing repository..."
            else
                # Create new repository
                gh repo create "$REPO_NAME" --public --source=. --remote=origin --push 2>&1 || {
                    echo "⚠️  Could not create repo automatically. Creating without push..."
                    gh repo create "$REPO_NAME" --public --source=. --remote=origin || true
                }
            fi
            
            # Push to GitHub
            echo "📤 Pushing to GitHub..."
            git remote remove origin 2>/dev/null || true
            git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git" 2>/dev/null || true
            git push -u origin main || {
                echo "⚠️  Push failed. Trying with force..."
                git push -u origin main --force || echo "❌ Push failed. Please push manually."
            }
            
            echo ""
            echo "✅ GitHub repository ready!"
            echo "🔗 URL: https://github.com/$GITHUB_USER/$REPO_NAME"
            echo ""
            echo "📋 Next: Deploy on Railway"
            echo "1. Go to: https://railway.app"
            echo "2. Click 'New Project' → 'Deploy from GitHub repo'"
            echo "3. Select: $GITHUB_USER/$REPO_NAME"
            echo "4. Add environment variables:"
            echo "   - GEMINI_API_KEY=your_key"
            echo "   - NODE_ENV=production"
            echo ""
            echo "🎉 Your app will be live in 2-3 minutes!"
            
        else
            echo "❌ Could not get GitHub username"
            manual_setup
        fi
    else
        echo "⚠️  GitHub CLI not authenticated"
        echo "   Run: gh auth login"
        manual_setup
    fi
else
    echo "⚠️  GitHub CLI not installed"
    manual_setup
fi

function manual_setup() {
    echo ""
    echo "📝 Manual Setup Required:"
    echo "1. Create repo at: https://github.com/new"
    echo "2. Then run:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/noor-e-ramadan.git"
    echo "   git push -u origin main"
    echo "3. Deploy on Railway: https://railway.app"
}
