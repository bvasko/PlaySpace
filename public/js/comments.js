// Comment on a playlist
const commentFormHandler = async (event) => {
  event.preventDefault();

  const playlist_id = document.querySelector('.post-id').innerHTML;
  const content = document.querySelector('.comment-content').value.trim();
  console.log(content);
  console.log(playlist_id);

  // const response = await fetch('/api/comments', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     content,
  //     playlist_id,
  //     user_id,
  //   }),
  //   headers: { 'Content-Type': 'application/json' },
  // });

  // if (response.ok) {
  //   document.location.reload();
  // } else {
  //   alert('Comment not added!');
  // }
  document.querySelector('.comment-content').value = '';
};

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

document
  .querySelector('.comment-submit')
  .addEventListener('click', commentFormHandler);

