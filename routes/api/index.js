const {Router} = require('express');
const router = Router();

// routes
const authRoutes = require('./auth');
const postsRoutes = require('./posts');
const messagesRoutes = require('./messages');
const chatRoutes = require('./chat');
const userRoutes = require('./user');

router.post('/test', async (req, res) => {
    res.json({ok: true, value: 2});
});

router.use('/', authRoutes);
router.use('/', postsRoutes);
router.use('/', messagesRoutes);
router.use('/', chatRoutes);
router.use('/', userRoutes);

module.exports = router;

