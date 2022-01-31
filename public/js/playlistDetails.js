// const playlistId = window.location.pathname.split('/')[1];
const spotifyId = $('#title').attr('data-spotify');
const base = 'https://api.spotify.com/v1';
const tracksUrl = `/playlists/${spotifyId}/tracks`;
const token = localStorage.getItem('access_token');
let tBody = $('#tBody');


function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

async function getPlaylistTracks() {
  const tracksEndpoint = `${base}${tracksUrl}`;
  const data = await fetch(tracksEndpoint, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const trackList = await data.json();
  console.log(trackList.items)
  trackList.items.forEach((item, index) => {
    const track = item.track;
    const artists = track.artists.map(artist => artist.name).join(', ');
    let row = `
      <tr>
      <td>${index + 1}</td>
      <td>
        ${track.name}<br/>${artists}
      </td>
      <td>${track.album.name}</td>
      <td>${millisToMinutesAndSeconds(track.duration_ms)}</td>
      </tr>`;
    $("#tBody").append(row);
  });

  return trackList;
}

const data = getPlaylistTracks();