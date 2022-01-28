const baseSpotifyAPI = 'https://api.spotify.com/v1';
const getSpotifyPlaylistURL = `${baseSpotifyAPI}/me/playlists?limit=50`;

module.exports = {getSpotifyPlaylistURL}