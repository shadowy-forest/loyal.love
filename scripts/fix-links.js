#!/usr/bin/env node

import fs from 'fs';
import path from 'path';


function fixLinks(htmlContent, filePath) {

    // convert relative paths to absolute paths
    let fixedContent = htmlContent.replace(
        /href="(?!https?:\/\/)([^"]+)"/g,
        (match, href) => {
            // skip if it's a data url or anchor
            if (href.startsWith('data:') || href.startsWith('#')) {
                return match;
            }
            // convert to absolute path
            const absolutePath = path.resolve(path.dirname(filePath), href);
            const relativePath = path.relative(process.cwd(), absolutePath);
            return `href="${relativePath}"`;
        }
    );

    // fix image sources
    fixedContent = fixedContent.replace(
        /src="(?!https?:\/\/)([^"]+)"/g,
        (match, src) => {
            // skip if it's a data url
            if (src.startsWith('data:')) {
                return match;
            }
            // convert to absolute path
            const absolutePath = path.resolve(path.dirname(filePath), src);
            const relativePath = path.relative(process.cwd(), absolutePath);
            return `src="${relativePath}"`;
        }
    );

    return fixedContent;
}

// process all html files
function processFiles() {
    const htmlFiles = [
        'index.html',
        ...fs.readdirSync('chapters').filter(file => file.endsWith('.html')),
        ...fs.readdirSync('shared').filter(file => file.endsWith('.html'))
    ];

    htmlFiles.forEach(file => {
        const filePath = path.join(process.cwd(), file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const fixedContent = fixLinks(content, filePath);
            fs.writeFileSync(filePath, fixedContent);
            console.log(`Fixed links in ${file}`);
        }
    });
}

processFiles();
