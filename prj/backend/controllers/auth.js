const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return

    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    const password = req.body.password;
    const CF = req.body.CF;

    try {
        const hashedPassword = await bcrypt.hash(password, 12);

        const userDetails = {
            CF: CF,
            name: name,
            surname: surname,
            email: email,
            password: hashedPassword
        }

        const result = await User.save(userDetails);

        res.status(201).json({ message: 'User registered!' });
    } catch (err) {
        // handle
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}