const {Router} = require('express');
const router = Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const authMiddleware = require('../middleware/auth');

const User = require('../models/User');

router.get('/foo', (req, res) => {
    res.json({a: 1})
});

router.post('/auth', (req, res) => {
    console.log(req.session);
    const auth = req.session.auth || false;
    res.json({auth});
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if (!user) {
        return res.status(400).json({message: 'Email does not exist'});
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (checkPassword) {
        const token = jwt.sign(
            {userId: user.id},
            config.get('jwtSecret'),
            {expiresIn: '1h'}
        );
        return res.json({token});
    } else {
        return res.status(400).json({message: 'Passwords are not identical'});
    }
});

router.post('/register', async (req, res) => {
    const {name, email, password} = req.body;

    const user = await User.findOne({email});

    if (user) {
        return res.status(400).json({message: 'Email is already exists'});
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
        name, email, password: hashPassword
    });

    await newUser.save();
    res.status(201).json({message: 'You have successfully registered!'});
});

router.post('/userData', authMiddleware, async (req, res) => {
    const user = await User.findOne({_id: req.user.userId});
    const data = {
        name: user.name
    };
    return res.json({data});
});

module.exports = router;

