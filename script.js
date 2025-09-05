const url = 'https://api.themoviedb.org/3/find/tt0816692?external_source=imdb_id';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MjgxYjNiMjZjYTM0Njg5YzRkZDA3NDQzYjRkZGJiZSIsIm5iZiI6MTc1NzAxNTQ1OS45NzYsInN1YiI6IjY4YjllZGEzYmNlN2IyYTI5ODliZjU0NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.YD93tnQBQtvEdqqyRbJ93zyo2escowlbw2vzuCu2rWo'
  }
};

let movieData;

//ELEMENTOS HTML
const poster = document.getElementById("poster");
const title = document.getElementById("title");


fetch(url, options)
  .then(res => res.json())
  .then(json => {
    movieData = json
    console.log(movieData)

    //ATRIBUIÇÃO DOS ELEMENTOS
    poster.src = `https://image.tmdb.org/t/p/w500${movieData.movie_results[0].poster_path}`;
    title.textContent = movieData.movie_results[0].title;


    })

  .catch(err => console.error(err));

