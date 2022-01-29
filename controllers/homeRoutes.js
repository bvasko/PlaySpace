const router = require('express').Router();
const { User, Playlist } = require('../models');
const withAuth = require('../utils/auth');
const request = require('request');
const querystring = require('querystring');
const fetch = require('node-fetch-commonjs');
const { PLAYLIST_URL } = require('../utils/spotifyHelper.js');

/** Render Homepage Route */
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
  } catch (error) {
    res.status(404).json(error);
  }
})

/** Render Playlist by ID */
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
    // res.status(200).json(playlistData);
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


/** SPOTIFY LOGIN FLoW */
const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET

/** Initialize login flow */
router.get('/spotify-login', function(req, res) {
  // Get the full redirect url
  const host = (req.hostname === 'localhost') ? 'http://localhost:3001' : process.env.FRONTEND_URI;
  const redirect_uri_login = `${host}/callback`;
  /**
   * Send spotify client_id to authorize url
   * This will return a code from spotify for step 2
   *
   * TODO: Replace querystring since it's deprecated
   * */
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'user-read-private user-read-email user-library-read',
      redirect_uri: redirect_uri_login
    }))
})


/**
 * Spotify authorize call redirects here
 * This redirect path needs to be added to the Spotify Developer account
 * by logging into spotify and going to 'edit settings'
 */
router.get('/callback', function(req, res) {
  //capture auth code from spotify
  const code = req.query.code || null
  const host = (req.hostname === 'localhost') ? 'http://localhost:3001' : process.env.FRONTEND_URI;
  // go back to /callback to check if access token is still valid
  const redirect_uri_login = `${host}/callback`;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirect_uri_login,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function(error, response) {
    try {
      const access_token = response.body.access_token
      const uri = `${host}/spotify-playlists`;
      res.redirect(uri + '?access_token=' + access_token);
    } catch (error){
      console.error(error);
      res.status(500).json(error);
    }
  })
})

/** Get the users first 20 spotify playlists **/
router.get('/spotify-playlists', async function(req, res) {
  try {
    const token = req.query.access_token;
    const data = await fetch(PLAYLIST_URL, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.query.access_token}`,
      },
    });
    const usersPlaylists = await data.json();
    const playlistData = await usersPlaylists.items.map(item => {
      console.log(item.tracks)
      return {
        description: item.description,
        name: item.name,
        tracks: item.tracks.total,
        id: item.id,
        image: item.images[0]?.url || '',
        ownerName: item.owner.display_name,
        ownerId: item.owner.id,
        public: item.public
      }
    })
    // res.status(200).json(playlistData)
    res.render('spotifyPlaylist', {
      playlists: playlistData,
      logged_in: req.session.logged_in
    });
    if (!token) {
      // TODO: GET REFRESH TOKEN
      res.status(200).json('need refresh token')
    }
  } catch(err) {
    res.status(500).json(err);
    console.log(err);
  }
})

module.exports = router;