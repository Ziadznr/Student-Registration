const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const router = express.Router();

// Register student
router.post('/register', async(req, res) => {
    const { name, email, password } = req.body;

    try {
        let student = await Student.findOne({ email });
        if (student) return res.status(400).json({ msg: 'Student already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        student = new Student({ name, email, password: hashedPassword });
        await student.save();

        const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });

        res.status(201).json({ msg: 'Student registered', student });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Login student
router.post('/login', async(req, res) => {
    const { email, password } = req.body;

    try {
        const student = await Student.findOne({ email });
        if (!student) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });

        res.json({ msg: 'Login successful', student });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// JWT middleware
const auth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.student = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};




export default router;