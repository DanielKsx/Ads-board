const fs = require('fs');
const path = require('path');

const removeFile = (filePath) => {
    if (!filePath) return;

    const fullPath = path.join(__dirname, '..', 'public', filePath);

    fs.unlink(fullPath, (err) => {
        if (err) {
            console.log('Error deleting file:', err.message);
        }
    });
};

module.exports = removeFile;