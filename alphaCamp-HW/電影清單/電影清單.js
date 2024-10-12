const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL =  BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = []
let filteredMovies = []
const dataPanel = document.querySelector('#data-panel')
const searchform = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input') 
const MOVIES_PER_PAGE = 12
const paginator = document.querySelector('#paginator')

function renderMovieList(data){
    let rawHtml = ''
   

    data.forEach((item) => {
        rawHtml += `<div class="col-sm-3">
                        <div class="mb-2">
                            <div class="card">
                                <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie posters">
                                <div class="card-body">
                                    <h5 class="card-title">${item.title}</h5>
                                </div>
                                <div class="card-footer">
                                    <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
                                    <button class="btn btn-info btn-add-favorite" data-id ='${item.id}'>+</button>
                                </div>
                            </div>
                        </div>
                    </div>`
    });

    dataPanel.innerHTML = rawHtml
}

function showMovieModal(id){
    const ModalTitle = document.querySelector("#movie-modal-title")
    const ModalDescription = document.querySelector("#movie-modal-description")
    const ModalImage = document.querySelector("#movie-modal-image")
    const ModalDate = document.querySelector("#movie-modal-date")
    

    axios.get(INDEX_URL + id).then((response) =>{
        const data = response.data.results
        
        ModalTitle.innerText = data.title
        ModalDescription.innerText = data.description
        ModalImage.innerHTML =  `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fuid">`
        ModalDate.innerText =  'Release date: ' + data.release_date
    })
}

function addToFavorite(id){
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = movies.find((movie) => movie.id === id) 

    if(list.some((movie) => movie.id === id)){
        return alert('此電影已經在收藏清單中！')
    }

    list.push(movie)
        localStorage.setItem('favoriteMovies',JSON.stringify(list))
    
}

function getMoviesByPage(page){
    const data = filteredMovies.length ? filteredMovies : movies
    const  startIndex = (page - 1) * MOVIES_PER_PAGE
    return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)

}

function renderPaginator(amount){
    const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
    let rawHTML = ''
    for (let page = 1; page <= numberOfPages; page++) {
        rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
      }
    paginator.innerHTML = rawHTML  
}

dataPanel.addEventListener('click',function onPanelClicked(event){
    if (event.target.matches('.btn-show-movie')) {
      showMovieModal(Number(event.target.dataset.id))  
    } else if(event.target.matches('.btn-add-favorite')){
        addToFavorite(Number(event.target.dataset.id))
    }
  })

searchform.addEventListener('submit' , function OnSearchFormSubmitted(event){
    event.preventDefault();
    const keyword = searchInput.value.trim().toLowerCase()
    
  if (!keyword.length) {
    return alert('請輸入有效字串！')
    }
    filteredMovies = movies.filter((movie) =>
        movie.title.toLowerCase().includes(keyword))

    if (filteredMovies.length === 0) {
        return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
    }
    renderPaginator(filteredMovies.length)
    renderMovieList(getMoviesByPage(1))

})

paginator.addEventListener('click', function onPaginatorClicked(event){
    if (event.target.tagName !== 'A') return
    const page = Number(event.target.dataset.page)
    renderMovieList(getMoviesByPage(page))
})

axios
  .get(INDEX_URL) 
  .then((response) => {
    
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(1))
  })
  .catch((err) => console.log(err))

