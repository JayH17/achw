// DEFAULT CODE ////////////////////////
const BASE_URL = 'https://webdev.alphacamp.io/api/lyrics/'
const songList = document.querySelector('#song-list')
const lyricsPanel = document.querySelector('#lyrics-panel')
const album = {
  artist: 'Adele',
  album: '25',
  tracks: [
    'Hello',
    'Send My Love (To Your New Lover)',
    'I Miss You',
    'When We Were Young',
    'Remedy',
    'Water Under the Bridge',
    'River Lea',
    'Love in the Dark',
    'Million Years Ago',
    'All I Ask',
    'Sweetest Devotion'
  ]
}

// WRITE YOUR CODE ////////////////////////
let songContent = ""
let lyricContent = ""

function SongList(album){
  album.tracks.forEach( song =>{
    songContent +=`
      <li class='nav-item' >
        <a class='nav-link ' href="#" >
          ${song}
        </a>
      </li>    
    `
  })
  songList.innerHTML = songContent
}


function  displaylyrics(song,lyrics){
  lyricContent = `
    <h2>${song}</h2>
    <pre>${lyrics}</pre>
    `
   lyricsPanel.innerHTML = lyricContent
}

songList.addEventListener ('click', event => {
  let activeitem = 
     document.querySelector('#song-list .active')
  
  if( activeitem){     activeitem.classList.remove('active')
  }
  
 if(event.target.matches('.nav-link')){
   event.target.classList.add('active')
 } 
  
  let song = event.target.innerText
  
  axios.get(`${BASE_URL}Adele/${song}.json`)
  .then(response =>{
    let lyrics = response.data.lyrics
    displaylyrics(song,lyrics)
  })
  .catch(error => console.log(error))
  
})

SongList(album)