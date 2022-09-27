let movie_id = location.pathname; //saving our location address 

//function to add comma and space between the data fetched from api(, )
const formatString = (currentIndex, maxIndex) => {
    return (currentIndex == maxIndex -1) ? '' : ', '; //if element is last then comma (, ) will not be added else it will return comman(, ) after every string.
}

//fetching the entire data of the movie with most details
fetch(`${movie_detail_http}${movie_id}?` + new URLSearchParams({
    api_key: api_key
}))
.then(res => res.json())
.then(data => {
    setupMovieInfo(data);
})
.catch(err => console.log(`Error in fetching movies details: ${err}`))

//function to display the fetched data of movies like - title, genre, description, background-image
const setupMovieInfo = (data) => {
    const movieName = document.querySelector('.movie-name');
    const genres = document.querySelector('.genres');
    const des = document.querySelector('.des');
    const title = document.querySelector('title');
    const backdrop = document.querySelector('.movie-info');

    title.innerHTML = movieName.innerHTML = data.title;
    genres.innerHTML = `${data.release_date.split('-')[0]} | `;
    for (let i=0; i<data.genres.length; i++){
        genres.innerHTML += data.genres[i].name + formatString(i, data.genres.length);
    }

    //will display +18 if movie data found to be adult
    if (data.adult == true) {
        genres.innerHTML += ' | +18';
    }
    
    //will change the backdrop path to poster path is backdrop data is not available in api object
    if (data.backdrop_path == null) {
        data.backdrop_path = data.poster_path;
    }

    des.innerHTML = data.overview.substring(0, 250) + '...';
    
    backdrop.style.backgroundImage = `url(${original_img_url}${data.backdrop_path})`;
}


//fetching the data of actors of movie
fetch(`${movie_detail_http}${movie_id}/credits?` + new URLSearchParams({
    api_key: api_key
}))
.then(res => res.json())
.then(data => {
    const cast = document.querySelector('.starring');
    for(let i=0; i<7; i++) {
        cast.innerHTML += data.cast[i].name + formatString(i, 7);
    }
})


//fetching movie clips related to that movie
fetch(`${movie_detail_http}${movie_id}/videos?` + new URLSearchParams({
    api_key: api_key
}))
.then(res => res.json())
.then(data => {
    let trailerContainer = document.querySelector('.trailer-container');
    let maxClips = (data.results.length > 4) ? 4 : data.results.length;
    for(let i=0; i<maxClips; i++) {
        trailerContainer.innerHTML += `
            <iframe src="https://youtube.com/embed/${data.results[i].key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        `;
    }
})

//fetching recommended data 
fetch(`${movie_detail_http}${movie_id}/recommendations?` + new URLSearchParams({
    api_key: api_key
}))
.then(res => res.json())
.then(data => {
    let container = document.querySelector('.recommendations-container');
    for (let i=0; i<19; i++){
        if(data.results[i].backdrop_path == null){
            i++;
        }
        container.innerHTML += `
            <div class="movie" onclick ="location.href = '/${data.results[i].id}'">  
                <img src="${img_url}${data.results[i].backdrop_path}">  
                <p class="movie-title">${data.results[i].title}</p>  
            </div>  
        `;
    }

})