const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../db');

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let user = await users.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    user = await users.insert({ 
      username, 
      email, 
      password: hashedPassword,
      createdAt: new Date()
    });

    const payload = { user: { id: user._id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Login (Demo Mode: Auto-Register if user doesn't exist)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await users.findOne({ email });
    
    if (!user) {
      // Auto-register for demo purposes
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user = await users.insert({ 
        username: email.split('@')[0], 
        email, 
        password: hashedPassword,
        createdAt: new Date()
      });
    } else {
      // Check password if user exists
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = { user: { id: user._id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get user
router.get('/me', require('../middleware/authMiddleware'), async (req, res) => {
  try {
    const user = await users.findOne({ _id: req.user.id });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
