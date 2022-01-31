
const queryStr = window.location.search.split('?')[1];
const queryArray = new URLSearchParams(queryStr);
const token = queryArray.get('access_token');
localStorage.setItem('access_token', token);

console.log('#', )

const transferPlaylist = async function(body, cb) {
  try {
    const playlist = await fetch('/api/playlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await playlist.json();
    console.log('added', data)
    cb();
    return data;
  } catch (err){
    console.error(err);
    return err;
  }
}

const removePlaylist = async function(id, cb) {
  const playlist = await fetch(`/api/playlist/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await playlist.json();
  console.log('removed', data)
  cb();
  return data;
}

$('.spotifyListAdd').on('click', function(evt) {
  const currNode = evt.currentTarget;
  const spotify_id = currNode.dataset.id;
  const name = currNode.dataset.name;
  const img_url = currNode.dataset.img_url;
  const body = {spotify_id, name, img_url};
  const cb = function() {
    $(currNode).html('<a class="btn-floating remove"><i class="material-icons">remove</i></a>');
  }.bind(this);
  transferPlaylist(body, cb);
});

$('.spotifyListRemove').on('click', function(evt) {
  const currNode = evt.currentTarget;
  const ps_id = currNode.dataset.playspaceid;
  const cb = function() {
    $(currNode).html('<a class="btn-floating add"><i class="material-icons">add</i></a>');
  }.bind(this);
  removePlaylist(ps_id, cb);
});