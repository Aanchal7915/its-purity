const fs = require('fs');
const path = require('path');

const dir = 'src';
const oldUrl = 'import.meta.env.VITE_API_BASE_URL';
const newUrl = 'import.meta.env.VITE_API_BASE_URL';

function walk(directory) {
    if (!fs.existsSync(directory)) return;
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const filepath = path.join(directory, file);
        const stat = fs.statSync(filepath);
        if (stat.isDirectory()) {
            walk(filepath);
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            let content = fs.readFileSync(filepath, 'utf8');
            if (content.includes(oldUrl)) {
                console.log(`Updating ${filepath}`);
                content = content.split(oldUrl).join(newUrl);
                fs.writeFileSync(filepath, content, 'utf8');
            }
        }
    }
}

walk(dir);
console.log("Finished updating ports.");
