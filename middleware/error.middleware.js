module.exports = (err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File is too large (max 2MB)' });
    }

    if (err.message === 'Only .jpg and .png files are allowed') {
        return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: err.message });
};