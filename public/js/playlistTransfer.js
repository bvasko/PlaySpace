 /**
  * on add button click
  *   POST playlist
  *   spotify_id and name
  *   to /api/playlist
  *
  * on POST success
  * - display 'Added' instead of add button
  *
  */

const transferPlaylist = async function(body) {
  const playlist = await fetch('/api/playlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await playlist.json();
  return data;
}

const removePlaylist = async function(id) {
  console.log(id)
  const playlist = await fetch(`/api/playlist/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await playlist.json();
  return data;
}

$('.spotifyListAdd').on('click', function(evt) {
  const currNode = evt.currentTarget;
  const spotify_id = currNode.dataset.id;
  const name = currNode.dataset.name;
  const img_url = currNode.dataset.img_url;
  const body = {spotify_id, name, img_url};
  const data = transferPlaylist(body);
  console.log('added', data)
});

$('.spotifyListRemove').on('click', function(evt) {
  const currNode = evt.currentTarget;
  const ps_id = currNode.dataset.playspaceid;
  const data = removePlaylist(ps_id);
  console.log('removed', ps_id, data)
});