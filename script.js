const url = 'https://api.themoviedb.org/3/find/tt0816692?external_source=imdb_id';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MjgxYjNiMjZjYTM0Njg5YzRkZDA3NDQzYjRkZGJiZSIsIm5iZiI6MTc1NzAxNTQ1OS45NzYsInN1YiI6IjY4YjllZGEzYmNlN2IyYTI5ODliZjU0NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.YD93tnQBQtvEdqqyRbJ93zyo2escowlbw2vzuCu2rWo' // Sua chave Bearer Token
  }
};

// ==========================================================
// ELEMENTOS HTML
// ==========================================================
const poster = document.getElementById("poster");
const title = document.getElementById("title");
const yearReleased = document.getElementById("year-released");
const genres = document.getElementById("genres");
const overview = document.getElementById("overview")
const directorElement = document.getElementById("director")
const writerElement = document.getElementById("writer");
const statusInfo = document.getElementById("status");
const languageInfo = document.getElementById("language");
const budgetInfo = document.getElementById("budget");
const revenueInfo = document.getElementById("revenue");
const reviewsContainer = document.getElementById("reviews-container");

const videoCount = document.getElementById("video-count");
const videoContainer = document.querySelector(".video-container");
const postersCount = document.getElementById("posters-count");
const posterContainer = document.querySelector(".poster-container");
const wallpaperCount = document.getElementById("wallpaper-count");
const wallpapersContainer = document.querySelector(".wallpapers-container");

// ==========================================================
// BUSCA NA API
// ==========================================================

// 1. Primeira busca para encontrar o filme e obter o ID do TMDB
fetch(url, options)
  .then(res => res.json())
  .then(findData => {
    // Pega o primeiro resultado da busca
    const movieInfo = findData.movie_results[0];
    if (!movieInfo) {
      console.error("Nenhum filme encontrado com este ID.");
      return;
    }

    const movieId = movieInfo.id; // <-- ID do TMDB
    // 2. Prepara as URLs para as buscas de detalhes e créditos
    const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=pt-BR`;
    const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=pt-BR`;
    const reviewsUrl = `https://api.themoviedb.org/3/movie/${movieId}/reviews?language=pt-B`;
    const videosUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?language=pt-BR`;
    const imagesUrl = `https://api.themoviedb.org/3/movie/${movieId}/images`;

    // 3. Usa Promise.all para fazer as duas buscas ao mesmo tempo
    return Promise.all([
      fetch(detailsUrl, options),
      fetch(creditsUrl, options),
      fetch(reviewsUrl, options),
      fetch(videosUrl, options),
      fetch(imagesUrl, options)
    ]);
  })
  .then(responses => Promise.all(responses.map(res => res.json()))) // Converte as duas respostas para JSON
  .then(([detailsData, creditsData, reviewsData, videosData, imagesData]) => { // Usa desestruturação para pegar os dados
    
    console.log("Detalhes:", detailsData);
    console.log("Créditos:", creditsData);
    console.log("Reviews:", reviewsData);

    // ==========================================================
    // ATRIBUIÇÃO DOS ELEMENTOS COM TODOS OS DADOS
    // ==========================================================
    
    // Dados da busca de detalhes (orçamento, receita, etc.)
    poster.src = `https://image.tmdb.org/t/p/w500${detailsData.poster_path}`;

    title.textContent = detailsData.title;

    if (detailsData.release_date) {
    // Pega a string da data (ex: "2014-10-22") e extrai os caracteres do índice 0 até o 4
    yearReleased.textContent = detailsData.release_date.substring(0, 4);
    } else {
    // Caso a data não exista, exibe um texto alternativo
    yearReleased.textContent = "N/A";
    }

    if (detailsData.genres && detailsData.genres.length > 0) {
      genres.textContent = detailsData.genres.map(genre => genre.name).join(', ');
    } else {
      genres.textContent = 'Gênero não informado';
    }

    overview.textContent = detailsData.overview;

    const crew = creditsData.crew;
    const directorInfo = crew.find(member => member.job === 'Director');
    const writerInfo = crew.filter(member => member.department === 'Writing');

    if (directorInfo) {
      directorElement.textContent = directorInfo.name; // <-- MUDANÇA 3: Usando a variável renomeada
    } else {
      directorElement.textContent = 'Não informado';
    }
    
    if (writerInfo) {
      writerElement.textContent = writerInfo.map(member => member.name).join(', ');
    } else {
      writerElement.textContent = 'Não informado';
    }

    const statusMap = {
        "Rumored": "Rumor",
        "Planned": "Planejado",
        "In Production": "Em produção",
        "Post Production": "Pós produção",
        "Released": "Lançado",
        "Canceled": "Cancelado"
    };
    statusInfo.textContent = statusMap[detailsData.status] || "Não encontrado";

    const languageMap = {
        "en": "Inglês",
        "pt": "Português",
        "es": "Espanhol",
        "fr": "Francês",
        "ja": "Japonês",
        "de": "Alemão",
        "ko": "Coreano"
    };
    languageInfo.textContent = languageMap[detailsData.original_language] || detailsData.original_language.toUpperCase();

    budgetInfo.textContent = detailsData.budget.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' });

    revenueInfo.textContent = detailsData.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' });



    reviewsContainer.innerHTML = ''; // Limpa o container

    if (reviewsData.results && reviewsData.results.length > 0) {
        // Pega apenas as 2 primeiras reviews, por exemplo
        const reviewsLimitadas = reviewsData.results.slice(0, 2);

        reviewsLimitadas.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.classList.add('review-card');

            // Cria o conteúdo do card
            reviewCard.innerHTML = `
                <p id="review-content" class="main-text text-justify">${review.content}</p>
                <p>por <span id="review-author" class="highlight-word">${review.author}</span></p>
                <div class="footer-info">
                    <span id="review-date" class="left-aligned-text">${new Date(review.updated_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    <span class="right-aligned-text">Nota: <span id="review-rate" class="highlight-word">${review.author_details.rating}</span>/10</span>
                </div>
            `;
            
            // Adiciona o card de review ao container na página
            reviewsContainer.appendChild(reviewCard);
        });
    } else {
        reviewsContainer.innerHTML = '<p>Nenhuma crítica encontrada para este filme.</p>';
    }


    const videoBoxes = videoContainer.querySelectorAll('.video-box');
    const trailers = videosData.results.filter(video => video.type === 'Trailer' && video.site === 'YouTube');
    videoCount.textContent = trailers.length;

    if (trailers.length > 0) {
    videoBoxes.forEach((box, index) => {
        const trailer = trailers[index];
        if (trailer) {
            
            box.dataset.videoKey = trailer.key;

            // miniatura com o botão de play por cima
            box.innerHTML = `
                <img src="https://img.youtube.com/vi/${trailer.key}/mqdefault.jpg" alt="${trailer.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
                <div class="play-button-overlay">▶</div>
            `;
            
            // Adiciona evento de clique
            box.addEventListener('click', function() {
                const key = this.dataset.videoKey;
                
                this.innerHTML = `
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src="https://www.youtube.com/embed/${key}?autoplay=1" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                `;
            }, { once: true }); // evento removido após o primeiro clique

        } else {
            box.style.display = 'none';
        }
    });
    }

  })
  .catch(err => console.error("Ocorreu um erro:", err));