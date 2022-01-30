console.log("modAL");
const playlistModal = async (event) => {
  event.preventDefault();
  const id = event.currentTarget.querySelector('#playlist-id').innerHTML;
  console.log(id);
  if(id){
    const response = await fetch(`/playlist/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      document.location.replace('/');
    }else{
      alert(response.statusText);
    }
  }
};

const playlistCards = document.querySelectorAll('.playlist-card')
playlistCards.forEach(playlistCard => playlistCard.addEventListener('click', playlistModal));