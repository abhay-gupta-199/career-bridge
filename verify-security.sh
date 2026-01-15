#!/bin/bash

# ============================================
# 🔐 Career Bridge Security Verification Script
# ============================================
# Run this to verify no secrets are being tracked
# Usage: bash verify-security.sh

echo "🔍 Career Bridge Security Verification"
echo "======================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track results
ISSUES_FOUND=0

echo "1️⃣  Checking .gitignore is in place..."
if [ -f ".gitignore" ]; then
    echo -e "${GREEN}✓${NC} .gitignore file exists"
else
    echo -e "${RED}✗${NC} .gitignore file not found!"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi
echo ""

echo "2️⃣  Checking for untracked .env files..."
if git check-ignore -q .env; then
    echo -e "${GREEN}✓${NC} Root .env is properly ignored"
else
    echo -e "${RED}✗${NC} Root .env is NOT ignored!"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

if git check-ignore -q server/.env; then
    echo -e "${GREEN}✓${NC} server/.env is properly ignored"
else
    echo -e "${RED}✗${NC} server/.env is NOT ignored!"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

if git check-ignore -q hybrid_roadmap/.env; then
    echo -e "${GREEN}✓${NC} hybrid_roadmap/.env is properly ignored"
else
    echo -e "${RED}✗${NC} hybrid_roadmap/.env is NOT ignored!"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

if git check-ignore -q client/.env; then
    echo -e "${GREEN}✓${NC} client/.env is properly ignored"
else
    echo -e "${RED}✗${NC} client/.env is NOT ignored!"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi
echo ""

echo "3️⃣  Checking for untracked dependencies..."
if git check-ignore -q node_modules/; then
    echo -e "${GREEN}✓${NC} node_modules/ is properly ignored"
else
    echo -e "${RED}✗${NC} node_modules/ is NOT ignored!"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

if git check-ignore -q hybrid_roadmap/venv/; then
    echo -e "${GREEN}✓${NC} hybrid_roadmap/venv/ is properly ignored"
else
    echo -e "${RED}✗${NC} hybrid_roadmap/venv/ is NOT ignored!"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi
echo ""

echo "4️⃣  Checking for secrets in current staging area..."
if git diff --cached | grep -qi "apikey\|password\|secret\|gemini\|aizasy"; then
    echo -e "${RED}✗${NC} Potential secrets found in staged changes!"
    echo "Review with: git diff --cached"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}✓${NC} No obvious secrets in staged changes"
fi
echo ""

echo "5️⃣  Checking for secrets in git history..."
if git log -p --all | grep -qi "AIzaSy" 2>/dev/null | head -5; then
    echo -e "${YELLOW}⚠${NC}  Warning: Found Gemini API pattern in history"
    echo "    Run: git log -p --all | grep -i 'AIzaSy'"
else
    echo -e "${GREEN}✓${NC} No Gemini API keys found in history"
fi
echo ""

echo "6️⃣  Status of all .env files..."
echo ""
echo "Should NOT be tracked (showing only if tracked):"
if git ls-files | grep -E "\.env|\.env\." | grep -v "\.env\.example"; then
    echo -e "${RED}✗${NC} Found tracked .env files! Remove with:"
    echo "   git rm --cached <filename>"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}✓${NC} No tracked .env files"
fi
echo ""

echo "Should be tracked:"
if git ls-files | grep -q "\.env\.example"; then
    echo -e "${GREEN}✓${NC} .env.example is tracked (good for templates)"
else
    echo -e "${YELLOW}ℹ${NC}  .env.example not found (optional)"
fi
echo ""

echo "======================================"
echo "📊 Summary"
echo "======================================"

if [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${GREEN}✓ All security checks passed!${NC}"
    echo ""
    echo "Your repository is secure:"
    echo "  ✓ No secrets in version control"
    echo "  ✓ .env files properly ignored"
    echo "  ✓ Dependencies not tracked"
    echo "  ✓ API keys protected"
    exit 0
else
    echo -e "${RED}✗ Found $ISSUES_FOUND security issue(s)!${NC}"
    echo ""
    echo "Please fix the issues above before committing."
    echo ""
    echo "To remove tracked secrets:"
    echo "  git rm --cached .env server/.env hybrid_roadmap/.env client/.env"
    echo "  git commit -m 'Remove secrets from version control'"
    exit 1
fi
