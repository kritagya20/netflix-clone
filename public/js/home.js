const main = document.querySelector('.main');

fetch(genres_list_http + new URLSearchParams({
    api_key: api_key
}))
.then(res => res.json())
.then(data => {
    data.genres.forEach(item => {
        fetchMoviesListByGenres(item.id, item.name);
    })
});

const fetchMoviesListByGenres = (id, genres) => {
    fetch(movie_genres_http + new URLSearchParams({
        api_key: api_key,
        with_genres: id,
        page: Math.floor(Math.random() * 3) + 1
    }))
    .then(res => res.json())
    .then(data => {
        makeCategoryElement(`${genres}_movies`, data.results);
    })
    .catch(err => console.log(err));
}   

const makeCategoryElement = (category, data) => {
    main.innerHTML += `
        <div class="movie-list"> 
            <button class="pre-btn"><img src="./images/pre.png" ></button> 
            <h1 class="movie-category">${category.split("_").join(" ")}</h1> 
            <div class="movie-container" id= "${category}" > 
            </div> 
            <button class="nxt-btn"><img src="./images/nxt.png" ></button> 
        </div> 
    `;
    makeCards(category, data);
}

const makeCards = (id, data) => {
    const movieContainer = document.getElementById(id);
    data.forEach((item, i) => {
        //will change the backdrop path to poster path is backdrop data is not available in api object
        if(item.backdrop_path == null){
             item.backdrop_path = item.poster_path;
            //will return if even poster path data is also not available in api object
             if(item.backdrop_path == null) {
                return;
            }
        }
        movieContainer.innerHTML += `
            <div class="movie" onclick="location.href = '/${item.id}'"> 
                <img src="${img_url}${item.backdrop_path}"> 
                <p class="movie-title">${item.title}</p> 
            </div> 
        `;

        if (i == data.length - 1){
            setTimeout(() => {
                setupScrolling();
            }, 100);
        }
    })
}