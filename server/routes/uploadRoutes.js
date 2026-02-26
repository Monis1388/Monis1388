const path = require('path');
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

router.post('/', upload.single('image'), (req, res) => {
    res.send(`/${req.file.path.replace(/\\/g, '/')}`);
});

router.get('/', (req, res) => {
    const uploadDir = 'uploads/';
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Unable to scan files' });
        }
        const fileList = files.filter(file => /\.(jpg|jpeg|png)$/i.test(file))
            .map(file => `/uploads/${file}`);
        res.json(fileList);
    });
});

router.delete('/:filename', (req, res) => {
    const filePath = path.join('uploads/', req.params.filename);
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error deleting file' });
            }
            res.json({ message: 'File deleted successfully' });
        });
    } else {
        res.status(404).json({ message: 'File not found' });
    }
});

module.exports = router;
