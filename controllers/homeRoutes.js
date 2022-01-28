const router = require('express').Router();
const { User, Playlist } = require('../models');
const withAuth = require('../utils/auth');
const request = require('request');
let querystring = require('querystring');

router.get('/', async (req, res) => {
  try {
    // Pass serialized data and session flag into template
    res.render('login');
  } catch (error) {
    res.status(404).json(error);
  }
});

router.get('/homepage', withAuth, async (req, res) => {
  try {
    // Get all playlists and JOIN with user data
    const playlistData = await Playlist.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const playlists = playlistData.map((playlist) => playlist.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', {
      playlists,
      logged_in: req.session.logged_in
    });
  } catch (error) {
    res.status(404).json(error);
  }
})

router.get('/playlist/:id', async (req, res) => {
  try {
    const playlistData = await Playlist.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const playlist = playlistData.get({ plain: true });

    res.render('playlist', {
      ...playlist,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Playlist }],
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
    res.redirect('/');
    return;
  }

  res.render('login');
});

let redirect_uri_login = 'http://localhost:3001/callback'
let client_id = process.env.SPOTIFY_CLIENT_ID
let client_secret = process.env.SPOTIFY_CLIENT_SECRET

router.get('/spotify-login', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'user-read-private user-read-email user-library-read',
      redirect_uri: redirect_uri_login
    }))
})

router.get('/callback', function(req, res) {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirect_uri_login,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token
    let uri = process.env.FRONTEND_URI || 'http://localhost:3001/playlists'

    res.redirect(uri + '?access_token=' + access_token)
  })
})


module.exports = router;