const apiKey = '9281b3b26ca34689c4dd07443b4ddbbe';

const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&page=1`;

const imageUrlBase = 'https://image.tmdb.org/t/p/w500';

// container onde os filmes serão exibidos
const moviesContainer = document.getElementById('movies-container');

// Função para buscar e exibir os filmes
async function fetchMovies() {
    try {
        // Faz a requisição para a API
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Pega a lista de filmes dos dados retornados
        const movies = data.results;

        // Limpa o container antes de adicionar novos filmes
        moviesContainer.innerHTML = '';

        // Itera sobre cada filme e cria um card para ele
        movies.forEach(movie => {
            // Cria os elementos HTML
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');

            const movieImage = document.createElement('img');
            movieImage.src = imageUrlBase + movie.poster_path;
            movieImage.alt = movie.title;

            const movieTitle = document.createElement('h3');
            movieTitle.textContent = movie.title;

            // Adiciona a imagem e o título ao card
            movieCard.appendChild(movieImage);
            movieCard.appendChild(movieTitle);

            // Adiciona o card completo ao container na página
            moviesContainer.appendChild(movieCard);
        });

    } catch (error) {
        console.error('Erro ao buscar os filmes:', error);
    }
}

// Chama a função para que tudo aconteça quando a página carregar
fetchMovies();