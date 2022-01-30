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

$('document').on('click','.spotifyList', function(evt) {
  console.log(evt.target);
});