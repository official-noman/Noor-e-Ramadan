#!/bin/bash

# Noor-e-Ramadan Deployment Script
echo "🚀 Noor-e-Ramadan Deployment Setup"
echo "===================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git branch -M main
    echo "✅ Git initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if .gitignore exists
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << EOF
node_modules
.next
.env
.env.local
.env*.local
.DS_Store
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.vscode
.idea
EOF
    echo "✅ .gitignore created"
fi

# Add all files
echo "📤 Adding files to git..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit"
else
    echo "💾 Committing changes..."
    git commit -m "Ready for deployment - Noor-e-Ramadan"
    echo "✅ Changes committed"
fi

# Show git status
echo ""
echo "📊 Current Git Status:"
git status --short

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Create a repository on GitHub: https://github.com/new"
echo "2. Copy the repository URL"
echo "3. Run these commands:"
echo "   git remote add origin YOUR_GITHUB_REPO_URL"
echo "   git push -u origin main"
echo ""
echo "4. Then go to Railway: https://railway.app"
echo "   - Click 'New Project'"
echo "   - Select 'Deploy from GitHub repo'"
echo "   - Choose your repository"
echo "   - Add environment variables:"
echo "     GEMINI_API_KEY=your_key"
echo "     NODE_ENV=production"
echo ""
echo "🎉 Your app will be live in 2-3 minutes!"
