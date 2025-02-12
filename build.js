const fs = require('fs');
const path = require('path');
const template = fs.readFileSync('template.html', 'utf8');
const originalsDir = path.join(__dirname, 'originals');
const contentDir = path.join(__dirname, 'content');
// Create output directory if it doesn't exist
if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
}
// Read all content files and build pages
fs.readdirSync(originalsDir).forEach(file => {
    if (file.endsWith('.html')) {
        try {
            const content = fs.readFileSync(path.join(originalsDir, file), 'utf8');
            // Extract title, fallback to filename if h2 not found
            const titleMatch = content.match(/<h2>(.*?)<\/h2>/);
            const title = titleMatch ? titleMatch[1] : file.replace('.html', '');
            // Replace template placeholders
            let page = template
                .replace('{{title}}', title)
                .replace('<div id="content-inject"></div>', content);
            // Fix relative paths in content
            page = page.replace(/(href|src)=["']\/(css|js|images)/g, '$1="../$2');
            fs.writeFileSync(path.join(contentDir, file), page);
            console.log(`✓ Built: ${file}`);
        } catch (error) {
            console.error(`✕ Error building ${file}:`, error);
        }
    }
});
console.log('\nBuild complete!')