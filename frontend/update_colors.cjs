const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir(directory, function(filePath) {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace hardcoded white backgrounds with black backgrounds (for transparency)
    content = content.replace(/rgba\(255,\s*255,\s*255/g, 'rgba(0, 0, 0');
    
    // Replace hardcoded #fff or #ffffff with dark slate
    content = content.replace(/#ffffff/gi, 'var(--text-main)');
    content = content.replace(/#fff/gi, 'var(--text-main)');
    content = content.replace(/#e5e7eb/gi, 'var(--text-main)');
    content = content.replace(/#d1d5db/gi, 'var(--text-muted)');
    
    // Replace rgba(23, 23, 23, 0.95) with white modal background
    content = content.replace(/rgba\(23,\s*23,\s*23,\s*0\.95\)/g, 'rgba(255, 255, 255, 0.95)');
    
    fs.writeFileSync(filePath, content, 'utf8');
  }
});

console.log("Colors updated for light theme!");
