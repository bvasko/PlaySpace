const router = require('express').Router();
const { User, Playlist } = require('../models');
const withAuth = require('../utils/auth');

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Project }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

router.get('/', withAuth, async (req, res) => {
  try {
    const playlistData = await Playlist.findAll({ include: [{ model: User }] });
    const playlist = playlistData.map(playlist => playlist.get({ plain: true }));
    console.log(playlist)
    res.status(200).json(playlist)
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  };
});

module.exports = router;