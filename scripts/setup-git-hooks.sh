#!/bin/bash

# get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$(git rev-parse --show-toplevel)"

# create symlinks for all hooks
for hook in post-commit; do
    if [ -f "$SCRIPT_DIR/git-hooks/$hook" ]; then
        ln -sf "$SCRIPT_DIR/git-hooks/$hook" "$REPO_ROOT/.git/hooks/$hook"
        echo "👾 installed $hook hook"
    fi
done

echo "✅ it hooks setup complete!"
