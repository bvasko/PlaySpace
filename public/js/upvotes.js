$('.upvote').on('click', function(evt){
var upvotes = evt.currentTarget.dataset.update+1;
const playlistId = evt.currentTarget.dataset.id;
  const response = await fetch(`/api/playlist/like/${playlistId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ upvotes })
  });
});

