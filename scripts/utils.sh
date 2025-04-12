#!/bin/bash

log() {
    echo -e "\n👾 $1"
}

success() {
    echo -e "\n✅ $1\n"
}

generate_rss() {
    log "generating rss feed..."
    if [ -d "venv" ]; then
        source venv/bin/activate
        python3 scripts/generate_rss.py
        deactivate
    else
        log "❌ virtual environment not found. please run 'make install' first"
        exit 1
    fi
    success "✅ rss feed generated at rss.xml"
}


run_lint() {
    log "👾 fixing links in html files..."
    node scripts/fix-links.js
    
    log "👾 formatting html files..."
    npx prettier --write --config .github/workflows/.prettierrc "index.html" "chapters/*.html" "shared/*.html" "404.html"
    
    log "👾 linting html files..."
    npx html-validate --config "$(pwd)/.github/workflows/.htmlvalidate.json" "index.html" "chapters/*.html" "shared/*.html" "404.html"  
    
    success "✅ linting completed"
}


run_clean() {
    log "👾 cleaning up..."
    rm -rf node_modules/
    rm -rf venv/
    rm -f .DS_Store
    success "✅ cleanup completed"
}


export -f log success generate_rss run_lint run_clean 
