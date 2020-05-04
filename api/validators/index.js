const { check } = require('express-validator');

const RegisterValidator = [ check('name', 'Name must have at least 2 characters').isLength({ min: 2 }),
    check('email', 'Email is not correct').isEmail(),
    check('password', 'Password must have at least 5 characters').isLength({ min: 5 }) ];

const LoginValidator = [
    check('email', 'Email is not correct').isEmail(),
    check('password', 'Password must have at least 5 characters').isLength({ min: 5 }) ];

module.exports = {
    RegisterValidator,
    LoginValidator
};
