#!/bin/bash

# JWT Compare Report Generator
# Usage: ./generate-report.sh <repo-path> <commit1> <commit2> [file] [format]

REPO_PATH=$1
COMMIT1=$2
COMMIT2=$3
FILE=$4
FORMAT=${5:-markdown}  # Default to markdown

if [ -z "$REPO_PATH" ] || [ -z "$COMMIT1" ] || [ -z "$COMMIT2" ]; then
  echo "Usage: $0 <repo-path> <commit1> <commit2> [file] [format]"
  echo ""
  echo "Arguments:"
  echo "  repo-path  : Path to the git repository"
  echo "  commit1    : Base commit hash"
  echo "  commit2    : Compare commit hash"
  echo "  file       : (Optional) Specific file to compare"
  echo "  format     : Report format: markdown, html, or json (default: markdown)"
  echo ""
  echo "Examples:"
  echo "  $0 /path/to/repo abc123 def456"
  echo "  $0 /path/to/repo abc123 def456 test-data/test.jose html"
  echo "  $0 /path/to/repo abc123 def456 '' json"
  exit 1
fi

# Build request body
if [ -n "$FILE" ]; then
  REQUEST_BODY="{\"repoPath\": \"$REPO_PATH\", \"commit1\": \"$COMMIT1\", \"commit2\": \"$COMMIT2\", \"file\": \"$FILE\", \"format\": \"$FORMAT\"}"
else
  REQUEST_BODY="{\"repoPath\": \"$REPO_PATH\", \"commit1\": \"$COMMIT1\", \"commit2\": \"$COMMIT2\", \"format\": \"$FORMAT\"}"
fi

echo "Generating $FORMAT report..."
echo "Repository: $REPO_PATH"
echo "Commits: $COMMIT1 → $COMMIT2"
if [ -n "$FILE" ]; then
  echo "File: $FILE"
fi
echo ""

# Call the API
RESPONSE=$(curl -s -X POST http://localhost:3001/api/git/generate-report \
  -H "Content-Type: application/json" \
  -d "$REQUEST_BODY")

# Extract filename and report content
FILENAME=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin).get('filename', 'report.txt'))")
REPORT=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin).get('report', ''))")

# Save the report
if [ -n "$REPORT" ]; then
  echo "$REPORT" > "$FILENAME"
  echo "✓ Report saved to: $FILENAME"
  echo ""
  echo "File size: $(wc -c < "$FILENAME") bytes"
else
  echo "✗ Failed to generate report"
  echo "Response: $RESPONSE"
  exit 1
fi
