const express = require('express');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
const { User } = require('../models');
const { validateUserRegistration } = require('../middleware/validation');
const { handleResponse } = require('../utils/responseHandler');

const router = express.Router();

router.post('/register', validateUserRegistration, async (req, res) => {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({ username, password: hashedPassword, role });
        return handleResponse(res, 200, 'User registered successfully', {userId: user.id});
    } catch (err) {
        return handleResponse(res, 500, 'Error creating user', err.message);
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return handleResponse(res, 401, 'Invalid credentials');
    }

    const token = generateToken({ id: user.id, role: user.role });
    return handleResponse(res, 200, 'token', token);
});

module.exports = router;

