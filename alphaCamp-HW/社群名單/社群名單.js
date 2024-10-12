const BASE_URL = 'https://user-list.alphacamp.io'
const INDEX_URL =  BASE_URL + '/api/v1/users/'
const users = []
let filteredUsers = []
const dataPanel = document.querySelector('#data-panel')
const searchform = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input') 
const USERS_PER_PAGE = 12
const paginator = document.querySelector('#paginator')

axios
  .get(INDEX_URL) 
  .then((response) => {

   users.push(...response.data.results)
    renderPaginator(users.length)
    renderUserList(getUsersByPage(1))
  })
  .catch((err) => console.log(err))

function renderUserList(data){
    let rawHtml = ''


    data.forEach((user) => {
        rawHtml += 
        ` <div class="col-sm-2">
                <div class=" mb-1" >
                  <button class="card">
                      <img src="${user.avatar}" class="card-img-top" alt="User" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${user.id}">
                  </button> 
                  <div  class=" p-0"> <p  class="fs-6">${user.name}  ${user.surname}</p> </div>
                </div>
            </div>`
    });

    dataPanel.innerHTML = rawHtml
}



function showUserModal(id){
    const ModalTitle = document.querySelector("#user-modal-title")
    const ModalId = document.querySelector("#user-modal-id")
    const ModalName = document.querySelector("#user-modal-name")
    const ModalSurname = document.querySelector("#user-modal-surname")
    const ModalEmail = document.querySelector("#user-modal-email")
    const ModalGender = document.querySelector("#user-modal-gender")
    const ModalAge = document.querySelector("#user-modal-age")
    const ModalRegion = document.querySelector("#user-modal-region")
    const ModalBirthday = document.querySelector("#user-modal-birthday")
    const ModalImage = document.querySelector("#user-modal-image ")


    axios.get(INDEX_URL + id).then((response) =>{
        const data = response.data

        ModalTitle.innerText =data.name + " " + data.surname
        ModalId.innerText = 'id :' + " " +  data.id
        ModalName.innerText = 'name :'+ " " +  data.name
        ModalSurname.innerText = 'surname :'+ " " +  data.surname
        ModalEmail.innerText = 'email :'+ " " +  data.email
        ModalGender.innerText = 'gender :' + " "+  data.gender
        ModalAge.innerText = 'age :'+ " " +  data.age
        ModalRegion.innerText = 'region :'+ " " +  data.region
        ModalBirthday.innerText = 'birthday :'+ " " +  data.birthday
        ModalImage.innerHTML = `<img src="${data.avatar}" class="img-fluid" alt="user image">`
    })
    .catch((err) => console.log(err))
}

function getUsersByPage(page){
    const data = filteredUsers.length ? filteredUsers : users
    const  startIndex = (page - 1) * USERS_PER_PAGE
    return data.slice(startIndex, startIndex + USERS_PER_PAGE)

}

function renderPaginator(amount){
    const numberOfPages = Math.ceil(amount /USERS_PER_PAGE)
    let rawHTML = ''
    for (let page = 1; page <= numberOfPages; page++) {
        rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
      }
    paginator.innerHTML = rawHTML  
}

dataPanel.addEventListener('click',function onPanelClicked(event){
    if (event.target.matches('img')) {
        console.log(event.target.dataset);
        showUserModal(Number(event.target.dataset.id));
    }
  })


searchform.addEventListener('submit' , function OnSearchFormSubmitted(event){
    event.preventDefault();
    const keyword = searchInput.value.trim().toLowerCase()

  if (!keyword.length) {
    return alert('請輸入有效字串！')
    }
    filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(keyword))

    if (filteredUsers.length === 0) {
        return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的人`)
    }
    renderPaginator(filteredUsers.length)
    renderUserList(getUsersByPage(1))

})

paginator.addEventListener('click', function onPaginatorClicked(event){
    if (event.target.tagName !== 'A') return
    const page = Number(event.target.dataset.page)
    renderUserList(getUsersByPage(page))
})
