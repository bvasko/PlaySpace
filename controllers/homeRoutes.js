const router = require('express').Router();
const { User, Playlist } = require('../models');
const withAuth = require('../utils/auth');
const request = require('request');
const querystring = require('querystring');
const {getSpotifyPlaylistURL} = require('../utils/spotify-helper.js');
router.get('/', withAuth, async (req, res) => {
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
  } catch (err) {
    res.status(500).json(err);
  }
});

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
    res.status('/');
    return;
  }

  res.render('login');
});

router.get('/playlist', withAuth, async (req, res) => {
  try {
    const playlistData = await Playlist.findAll({ include: [{ model: User }] });
    const playlist = playlistData.map(playlist => playlist.get({ plain: true }));
    console.log(playlist)
    res.status(200).json(playlist)
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET

router.get('/spotify-login', function(req, res) {
  const host = (req.hostname === 'localhost') ? 'http://localhost:3001' : process.env.FRONTEND_URI;
  const redirect_uri_login = `${host}/callback`;
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'user-read-private user-read-email user-library-read',
      redirect_uri: redirect_uri_login
    }))
})

router.get('/spotify-playlists', async function(req, res) {
  const token = req.params.access_token;
  console.log('session', req.params.access_token);
  try {
    if (!token) {
      res.status(200).json('not authenticated')
    }
    const playlists = await fetch(getSpotifyPlaylistURL, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log('spotify', playlists);
    if (!playlists) {
      res.status(404).json({ message: 'No playlists found' });
      return;
    }
    res.status(200).json(playlists)
  } catch(err) {
    res.status(500).json(err);
  }
})

router.get('/callback', function(req, res) {
  const code = req.query.code || null
  const host = (req.hostname === 'localhost') ? 'http://localhost:3001' : process.env.FRONTEND_URI;
  const redirect_uri_login = `${host}/callback`;
  const authOptions = {
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
    console.log('spotify: ', response.body, body);
    const access_token = body.access_token
    const uri = `${host}/spotify-playlists`;

    res.redirect(uri + '?access_token=' + access_token)
  })
})


module.exports = router;