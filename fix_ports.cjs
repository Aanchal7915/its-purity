const fs = require('fs');
const path = require('path');

const dir = 'src';
const oldUrl = 'http://localhost:5000';
const newUrl = 'http://localhost:5002';

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
