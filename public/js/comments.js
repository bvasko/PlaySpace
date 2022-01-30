// Comment on a playlist
const commentFormHandler = async (event) => {
  event.preventDefault();

  const playlist_id = document.querySelector('#post-id').innerHTML;
  const content = document.querySelector('#comment_content').value.trim();

  const response = await fetch('/api/comments', {
    method: 'POST',
    body: JSON.stringify({
      content,
      playlist_id,
      user_id,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    document.location.reload();
  } else {
    alert('Comment not added!');
  }
};

// do I need this?
// $(document).ready(function(){
//  $('.comment-modal-trigger').leanModal();
// });

document
  .querySelector('.new-comment-form')
  .addEventListener('submit', commentFormHandler);
