#!/bin/bash

API_URL="http://localhost:3001"

if [ "$#" -eq 4 ]; then
    API_URL=$4
    shift
fi

if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <repo-path> <commit1> <commit2> [api-url]"
    echo "Example: $0 /tmp/persistent-test-repo HEAD~1 HEAD"
    echo "Example: $0 /tmp/persistent-test-repo HEAD~1 HEAD http://your-server.com/api/git/compare"
    exit 1
fi

REPO_PATH=$1
COMMIT1=$2
COMMIT2=$3

echo "=== Git Commit Comparison Report ==="
echo "API: $API_URL"
echo "Repo: $REPO_PATH"
echo "Comparing: $COMMIT1 → $COMMIT2"
echo ""

# 调用后端 API
RESPONSE=$(curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d "{\"repoPath\":\"$REPO_PATH\",\"commit1\":\"$COMMIT1\",\"commit2\":\"$COMMIT2\"}")

# 解析 JSON
TOTAL=$(echo $RESPONSE | grep -o '"totalFiles":[0-9]*' | cut -d':' -f2)
FOUND=$(echo $RESPONSE | jq -r '.files | length')

echo "Total changed files: $TOTAL"
echo "JWT files found: $FOUND"
echo ""

if [ "$FOUND" -gt 0 ]; then
    echo "=== JWT Files ==="
    echo $RESPONSE | jq -r '.files[] | "- \(.path)"'
    echo ""

    echo "=== Detailed Changes ==="
    echo $RESPONSE | jq -r '.files[] | "File: \(.path)\nChanges: \(.changes | length) parts\n"'
else
    echo "No JWT files found in the changes."
fi
