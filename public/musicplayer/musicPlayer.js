const token = { headers: { 'Authorization': localStorage.getItem('token') } }


window.addEventListener('DOMContentLoaded', () => {
  getMusicList()
})

async function getMusicList() {
  try {
    const musicList = await axios.get('http://localhost:1010/musicList', token)
    console.log(musicList)
    for (let i = 0; i < musicList.data.length; i++) {
      appendMusic(musicList.data[i])
    }
  } catch (error) {
    console.log(error)
  }
}

function appendMusic(data) {
  const musicList = document.getElementById('musicList')
  const ul = document.getElementById('musicList')
  const li = document.createElement('li')
  const btn = document.createElement('button')
  li.textContent = data.title;
  // li.classList.add('musicLi')
  li.className = 'musicLi'
  btn.textContent = 'play';
  // btn.classList.add('btn btn-success')
  btn.className = 'btn btn-primary btn-sm'
  btn.dataset.musicUrl = data.url;
  btn.addEventListener('click', () => {
    playMusic(data)
  })
  li.appendChild(btn);

  ul.appendChild(li)
  musicList.scrollTop = musicList.scrollHeight
}

function playMusic(data) {
  const playMusicCard = document.getElementById('playMusicCard')
  //    const musicDiv = document.getElementById('musicDiv')
  const oldAudio = document.querySelector('audio');
  if (oldAudio) {
    playMusicCard.removeChild(oldAudio)
  }
  const newAudio = document.createElement('audio');
  newAudio.id = 'music-url';
  newAudio.controls = true;
  newAudio.src = data.url;
  const title = document.getElementById('musicTitle')
  const genre = document.getElementById('musicGenre')
  title.innerHTML = data.title;
  genre.innerHTML = data.genre;

  playMusicCard.appendChild(newAudio)
}