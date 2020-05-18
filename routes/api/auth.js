const {Router} = require('express');
const router = Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const authMiddleware = require('../../middleware/auth');
const { validationResult } = require('express-validator');
const { RegisterValidator, LoginValidator } = require('../../validators');

const User = require('../../models/User');
const Post = require('../../models/Post');

// router.post('/auth', (req, res) => {
//     const auth = req.session.auth || false;
//     res.json({auth});
// });

router.post('/login', LoginValidator, async (req, res) => {
    try {
        const {email, password} = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorsArray = errors.array();
            return res.status(422).json({ errors: errorsArray, message: errorsArray[0].msg });
        }

        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({errors: [], message: 'Email does not exist'});
        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if (checkPassword) {
            const token = jwt.sign(
                {userId: user.id},
                config.get('jwtSecret'),
                {expiresIn: '1h'}
            );
            return res.json({token: `Bearer ${token}`});
        } else {
            return res.status(400).json({errors: [], message: 'Passwords are not identical'});
        }
    } catch (e) {
        res.status(500).end();
    }
});

router.post('/register', RegisterValidator, async (req, res) => {
    try {
        const {name, email, password} = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorsArray = errors.array();
            return res.status(422).json({ errors: errorsArray, message: errorsArray[0].msg });
        }

        const user = await User.findOne({email});

        if (user) {
            return res.status(400).json({ errors: [], message: 'Email is already exists'});
        }

        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            name, email, password: hashPassword
        });

        await newUser.save();

        res.status(201).json({message: 'You have successfully registered!'});
    } catch (e) {
        res.status(500).end();
    }
});

router.post('/userData', authMiddleware, async (req, res) => {
    try {
        const {userId} = req.user;

        const user = await User.findOne({_id: userId});
        const posts = await Post.find({
            // owner: userId,
            wallOwner: userId
        });

        const postsWithImages = posts.filter(p => p.imageUrl);
        const imagesCount = postsWithImages.length;

        const data = {
            name: user.name,
            id: user._id,
            avatarUrl: user.avatarUrl,
            followersCount: user.followers.length || 0,
            followingCount: user.following.length || 0,
            postsCount: posts.length,
            imagesCount: imagesCount
        };

        return res.json({data});
    } catch (e) {
        res.status(500).end();
    }
});

module.exports = router;
