const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const cheerio = require('cheerio');

// Function to fix common link issues
function fixLink(link) {
    if (!link) return link;
    
    try {
        // Trim whitespace
        link = link.trim();
        
        // Remove trailing slashes
        link = link.replace(/\/+$/, '');
        
        // Fix double slashes
        link = link.replace(/([^:])\/\//g, '$1/');
        
        // Ensure relative paths start with ./
        if (!link.startsWith('http') && !link.startsWith('/') && !link.startsWith('./')) {
            link = './' + link;
        }
    } catch (err) {
        console.warn(`Warning: Could not fix link "${link}": ${err.message}`);
        return link;
    }
    
    return link;
}

// Function to process a single HTML file
function processFile(filePath) {
    try {
        // Read file with original line endings
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Store original line endings
        const lineEnding = content.includes('\r\n') ? '\r\n' : '\n';
        
        // Store original DOCTYPE
        const doctypeMatch = content.match(/<!DOCTYPE[^>]*>/i);
        const originalDoctype = doctypeMatch ? doctypeMatch[0] : null;
        
        // First, let's extract and store all comments with their exact formatting
        const comments = [];
        let currentPos = 0;
        const commentRegex = /<!--[\s\S]*?-->/g;
        let match;
        
        while ((match = commentRegex.exec(content)) !== null) {
            const commentText = match[0];
            const isSpecial = commentText.includes('.');
            comments.push({
                text: commentText,
                start: match.index,
                end: match.index + commentText.length,
                isSpecial
            });
        }
        
        // Load with specific options to preserve structure
        const $ = cheerio.load(content, {
            decodeEntities: false,
            xmlMode: false,
            withDomLvl1: true,
            normalizeWhitespace: false
        });
        
        let modified = false;

        // Process all links with error handling
        $('a[href]').each((i, elem) => {
            try {
                const href = $(elem).attr('href');
                const fixedHref = fixLink(href);
                if (href !== fixedHref) {
                    $(elem).attr('href', fixedHref);
                    modified = true;
                }
            } catch (err) {
                console.warn(`Warning: Could not process link in ${filePath}: ${err.message}`);
            }
        });

        // Process all image sources with error handling
        $('img[src]').each((i, elem) => {
            try {
                const src = $(elem).attr('src');
                const fixedSrc = fixLink(src);
                if (src !== fixedSrc) {
                    $(elem).attr('src', fixedSrc);
                    modified = true;
                }
            } catch (err) {
                console.warn(`Warning: Could not process image in ${filePath}: ${err.message}`);
            }
        });

        // Process all script sources with error handling
        $('script[src]').each((i, elem) => {
            try {
                const src = $(elem).attr('src');
                const fixedSrc = fixLink(src);
                if (src !== fixedSrc) {
                    $(elem).attr('src', fixedSrc);
                    modified = true;
                }
            } catch (err) {
                console.warn(`Warning: Could not process script in ${filePath}: ${err.message}`);
            }
        });

        // Process all link hrefs with error handling
        $('link[href]').each((i, elem) => {
            try {
                const href = $(elem).attr('href');
                const fixedHref = fixLink(href);
                if (href !== fixedHref) {
                    $(elem).attr('href', fixedHref);
                    modified = true;
                }
            } catch (err) {
                console.warn(`Warning: Could not process link tag in ${filePath}: ${err.message}`);
            }
        });

        if (modified) {
            // Get the modified HTML
            let html = $.html({ 
                decodeEntities: false,
                xmlMode: false,
                normalizeWhitespace: false
            });

            // Restore original DOCTYPE if it exists
            if (originalDoctype) {
                html = html.replace(/<!doctype[^>]*>/i, originalDoctype);
            }

            // Restore all special comments with their exact original formatting
            comments.forEach(comment => {
                if (comment.isSpecial) {
                    // Create a placeholder that won't appear in normal content
                    const placeholder = `__COMMENT_PLACEHOLDER_${Math.random().toString(36)}_`;
                    html = html.replace(comment.text, placeholder);
                    // Restore the exact original comment
                    html = html.replace(placeholder, comment.text);
                }
            });

            // Restore original line endings
            html = html.replace(/\r?\n/g, lineEnding);
            
            // Write the file with original line endings
            fs.writeFileSync(filePath, html);
            console.log(`Fixed links in: ${filePath}`);
        }
    } catch (err) {
        console.error(`Error processing file ${filePath}: ${err.message}`);
    }
}

// Find all HTML files
async function main() {
    try {
        // Explicitly process index.html and all HTML files in chapters directory
        const files = await glob(['index.html', 'chapters/**/*.html']);
        
        if (files.length === 0) {
            console.warn('Warning: No HTML files found to process');
            return;
        }

        console.log(`Found ${files.length} HTML files to process:`);
        files.forEach(file => {
            try {
                processFile(file);
            } catch (err) {
                console.error(`Error processing file ${file}:`, err);
            }
        });
        console.log('Link fixing process completed!');
    } catch (err) {
        console.error('Error finding HTML files:', err);
        process.exit(1);
    }
}

main(); 
