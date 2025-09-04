// =================================================================
// PASSO 1: CONFIGURAÇÃO INICIAL
// =================================================================

// Cole aqui a sua Chave da API (v3 auth) que você pegou no site do TMDB
const apiKey = '9281b3b26ca34689c4dd07443b4ddbbe';

// URLs base da API e para as imagens
const apiUrlBase = 'https://api.themoviedb.org/3';
const imageUrlBase = 'https://image.tmdb.org/t/p/w500';

// Seleciona o elemento no HTML onde vamos exibir os filmes
const moviesContainer = document.getElementById('movies-container');


// =================================================================
// PASSO 2: FUNÇÃO PARA BUSCAR E EXIBIR OS FILMES
// =================================================================

// Usamos 'async' para indicar que esta função fará operações que demoram (como chamar a API)
async function getPopularMovies() {

    // Monta a URL completa para buscar filmes populares
    const url = `${apiUrlBase}/movie/popular?api_key=${apiKey}&language=pt-BR&page=1`;

    // O bloco try...catch serve para capturar erros. Se algo der errado na busca,
    // o código dentro do 'catch' será executado.
    try {
        // 1. Fazer a requisição para a API usando fetch()
        // 'await' pausa a execução da função até que a resposta da API chegue.
        const response = await fetch(url);
        
        // 2. Converter a resposta para o formato JSON
        // 'await' novamente, pois a conversão também leva um tempo.
        const data = await response.json();

        // 3. Chamar a função que vai realmente exibir os filmes na tela
        displayMovies(data.results);

    } catch (error) {
        // Se ocorrer um erro (ex: sem internet, chave errada), ele será mostrado no console do navegador.
        console.error("Houve um erro ao buscar os filmes:", error);
    }
}


// =================================================================
// PASSO 3: FUNÇÃO PARA EXIBIR OS FILMES NO HTML
// =================================================================

function displayMovies(movies) {
    // Limpa qualquer conteúdo que já exista no container
    moviesContainer.innerHTML = '';

    // Passa por cada item da lista de filmes ('movies') que a API retornou
    movies.forEach(movie => {
        // Cria um novo elemento <div> para ser o card do filme
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card'); // Adiciona a classe CSS para estilização

        // Monta a URL completa da imagem do pôster
        const posterUrl = movie.poster_path ? imageUrlBase + movie.poster_path : 'https://via.placeholder.com/200x300.png?text=Sem+Imagem';
        
        // Define o conteúdo HTML de cada card
        movieCard.innerHTML = `
            <img src="${posterUrl}" alt="Pôster do filme ${movie.title}">
            <h3>${movie.title}</h3>
            <p>Nota: ${movie.vote_average.toFixed(1)}</p>
        `;
        // O toFixed(1) formata a nota para ter apenas uma casa decimal.

        // Adiciona o card recém-criado dentro do 'moviesContainer' no HTML
        moviesContainer.appendChild(movieCard);
    });
}


// =================================================================
// PASSO 4: CHAMADA INICIAL
// =================================================================

// Chama a função principal para iniciar todo o processo assim que a página carrega.
getPopularMovies();