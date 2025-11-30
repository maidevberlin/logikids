#!/bin/bash
# Format files after Claude writes or edits them
# This hook runs prettier on modified files

set -e

# Get the file path from the hook input (passed via stdin as JSON)
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.pathInProject // empty')

# If no file path, exit silently
if [ -z "$FILE_PATH" ]; then
    exit 0
fi

# Get the project root (where this script is located, up two levels)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Convert relative path to absolute if needed
if [[ "$FILE_PATH" != /* ]]; then
    FILE_PATH="$PROJECT_ROOT/$FILE_PATH"
fi

# Check if the file exists and is a formattable type
if [ ! -f "$FILE_PATH" ]; then
    exit 0
fi

# Get file extension
EXT="${FILE_PATH##*.}"

# Only format supported file types
case "$EXT" in
    js|jsx|ts|tsx|json|css|scss|md|html|yaml|yml)
        cd "$PROJECT_ROOT"
        bunx prettier --write "$FILE_PATH" 2>/dev/null || true
        ;;
esac

exit 0
