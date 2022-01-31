$('.upvote').on('click', async function(evt){
var upvotes = parseInt(evt.currentTarget.dataset.update) + 1;
const playlistId = evt.currentTarget.dataset.id;
  const response = await fetch(`/api/playlist/like/${playlistId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ upvotes })
  });
  console.log($(evt.currentTarget).html())
  const data = await response.json();
  $(evt.currentTarget).html(`<i class="material-icons">thumb_up</i> ${data.upvotes}`)
});

