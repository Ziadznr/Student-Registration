const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const Student = require('../models/Student');
const router = express.Router();

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage }).single('profilePicture');

// File upload
router.post('/upload', auth, upload, async(req, res) => {
    try {
        const student = await Student.findById(req.student.id);
        if (!student) return res.status(404).json({ msg: 'Student not found' });

        student.profilePicture = req.file.filename;
        await student.save();

        res.json({ msg: 'File uploaded', file: req.file });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

export default router;