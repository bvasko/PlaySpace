const router = require('express').Router();
const userRoutes = require('./userRoutes');
const playlistRoutes = require('./playlistRoutes');

router.use('/users', userRoutes);
router.use('/playlist', playlistRoutes);

module.exports = router;