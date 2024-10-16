const express = require('express');
const Student = require('../models/Student');
const auth = require('../middleware/auth');
const router = express.Router();

// Get student profile
router.get('/profile', auth, async(req, res) => {
    try {
        const student = await Student.findById(req.student.id).select('-password');
        if (!student) return res.status(404).json({ msg: 'Student not found' });
        res.json(student);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Update student profile
router.put('/profile', auth, async(req, res) => {
    const { name, email } = req.body;

    try {
        const student = await Student.findById(req.student.id);
        if (!student) return res.status(404).json({ msg: 'Student not found' });

        student.name = name || student.name;
        student.email = email || student.email;
        await student.save();

        res.json({ msg: 'Profile updated', student });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

export default router;