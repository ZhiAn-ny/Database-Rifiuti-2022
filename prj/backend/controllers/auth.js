const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    try {
        const hashedPassword = await bcrypt.hash(password, 12);

        const userDetails = {
            name: name,
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

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    
    try {
        const user = await User.find(email);

        if (user[0].length !== 1) {
            const error = new Error("Couldn't find a user with this email");
            error.statusCode = 404;
            throw error;
        }

        const found = user[0][0];

        const isEqual = await bcrypt.compare(password, found.password)

        if (!isEqual) {
            const error = new Error("Wrong password");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            { 
                email: found.email,
                ID: found.id,
            },
            'secretfortoken',
            { expiresIn: '1h' } 
        )

        res.status(200).json({ token: token, ID: found.id });
    } catch (err) {
        console.error(err)
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
