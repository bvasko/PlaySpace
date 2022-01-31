// Comment on a playlist
$('.comment-form').submit(async function(evt){
  evt.preventDefault();
  var content = evt.currentTarget.querySelector('.comment-content').value.trim();
  const playlist_id = evt.currentTarget.dataset.pid;
  const user_id = evt.currentTarget.dataset.uid;
  console.log(content);
  console.log(playlist_id);
  console.log(user_id);

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
  document.querySelectorAll('.comment-content').forEach(textArea => textArea.value = '');
});

(function($){
  $.fn.leanModal = function(options) {
    if( $('.modal').length > 0 ){
        $('.modal').modal(options);
    }
  };

  $.fn.openModal = function(options) {
    $(this).modal(options);
    $(this).modal('open');
  };

  $.fn.closeModal = function() {
    $(this).modal('close');
  };
})(jQuery);


