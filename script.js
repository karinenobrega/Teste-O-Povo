let imdbMovieId = 'tt1517268';

const url = `https://api.themoviedb.org/3/find/${imdbMovieId}?external_source=imdb_id`;
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MjgxYjNiMjZjYTM0Njg5YzRkZDA3NDQzYjRkZGJiZSIsIm5iZiI6MTc1NzAxNTQ1OS45NzYsInN1YiI6IjY4YjllZGEzYmNlN2IyYTI5ODliZjU0NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.YD93tnQBQtvEdqqyRbJ93zyo2escowlbw2vzuCu2rWo' // Sua chave Bearer Token
  }
};

// ELEMENTOS HTML

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

const castMembers = document.getElementById("carousel-track");
//MEDIA ELEMENTS//
const videoCount = document.getElementById("video-count");
const videoContainer = document.querySelector(".video-container");
const postersCount = document.getElementById("posters-count");
const posterImagesContainer = document.getElementById("poster-container");
const wallpaperCount = document.getElementById("wallpaper-count");
const wallpapersContainer = document.getElementById("wallpapers-container");

const recommendationsContainer = document.getElementById("rec-container")

// BUSCA NA API

fetch(url, options)
  .then(res => res.json())
  .then(findData => {

    const movieInfo = findData.movie_results[0];
    if (!movieInfo) {
      console.error("Nenhum filme encontrado com este ID.");
      return;
    }

    const movieId = movieInfo.id; // ID do TMDB

    // URLS DE BUSCA //
    const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=pt-BR`;
    const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=pt-BR`;
    const reviewsUrl = `https://api.themoviedb.org/3/movie/${movieId}/reviews?language=pt-B`;
    const videosUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?language=pt-BR`;
    const imagesUrl = `https://api.themoviedb.org/3/movie/${movieId}/images`;
    const recommendationsUrl = `https://api.themoviedb.org/3/movie/${movieId}/recommendations?language=pt-BR`;

    
    return Promise.all([
      fetch(detailsUrl, options),
      fetch(creditsUrl, options),
      fetch(reviewsUrl, options),
      fetch(videosUrl, options),
      fetch(imagesUrl, options),
      fetch(recommendationsUrl, options)
    ]);
  })
  .then(responses => Promise.all(responses.map(res => res.json())))
  .then(([detailsData, creditsData, reviewsData, videosData, imagesData, recommendationsData]) => {
    
    console.log("Detalhes:", detailsData);
    console.log("Créditos:", creditsData);
    console.log("Reviews:", reviewsData);
    console.log("Vídeos:", videosData);
    console.log("Imagens:", imagesData);
    console.log("Recomendações:", recommendationsData);

    // ATRIBUIÇÃO DOS ELEMENTOS COM TODOS OS DADOS //
    
    //POSTER IMAGE//
    poster.src = `https://image.tmdb.org/t/p/w500${detailsData.poster_path}`;
    poster.alt = `Poster do filme: ${detailsData.title}. ${detailsData.tagline}`;

    //TITLE//
    title.textContent = detailsData.title;

    //RELEASE DATE//
    if (detailsData.release_date) {
    yearReleased.textContent = detailsData.release_date.substring(0, 4);
    } else {
    yearReleased.textContent = "N/A";
    }

    if (detailsData.genres && detailsData.genres.length > 0) {
      genres.textContent = detailsData.genres.map(genre => genre.name).join(', ');
    } else {
      genres.textContent = 'Gênero não informado';
    }

    //OVERVIEW//
    overview.textContent = detailsData.overview;

    //DIRECTOR AND WRITER//
    const crew = creditsData.crew;
    const directorInfo = crew.find(member => member.job === 'Director');
    const writerInfo = crew.filter(member => member.department === 'Writing');

    if (directorInfo) {
      directorElement.textContent = directorInfo.name;
    } else {
      directorElement.textContent = 'Não informado';
    }
    
    if (writerInfo) {
      writerElement.textContent = writerInfo.map(member => member.name).join(', ');
    } else {
      writerElement.textContent = 'Não informado';
    }

    //STATUS//
    const statusMap = {
        "Rumored": "Rumor",
        "Planned": "Planejado",
        "In Production": "Em produção",
        "Post Production": "Pós produção",
        "Released": "Lançado",
        "Canceled": "Cancelado"
    };
    statusInfo.textContent = statusMap[detailsData.status] || "Não encontrado";

    //ORIGINAL LANGUAGE//
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

    //BUDGET//
    budgetInfo.textContent = detailsData.budget.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' });

    //REVENUE//
    revenueInfo.textContent = detailsData.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' });

    //CAST MEMBERS//
    castMembers.innerHTML = '';

    if (creditsData.cast && creditsData.cast.length > 0) {
        const castLimitados = creditsData.cast.slice(0, 10);

        castLimitados.forEach(cast => {
            const carouselCard = document.createElement('div');
            carouselCard.classList.add('carousel-card');

            carouselCard.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${cast.profile_path}" alt="${cast.name}">
                <h4>${cast.name}</h4>
                <p>${cast.character}</p>
            `;
            
            castMembers.appendChild(carouselCard);
        });
    } else {
        castMembers.innerHTML = '<p>Nenhum elenco encontrado para este filme.</p>';
    }

    
    //REVIEWS//
    reviewsContainer.innerHTML = '';

    if (reviewsData.results && reviewsData.results.length > 0) {
        const reviewsLimitadas = reviewsData.results.slice(0, 2);

        reviewsLimitadas.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.classList.add('review-card');

            reviewCard.innerHTML = `
                <div class="text-wrapper">
                    <p id="review-content" class="main-text text-justify">${review.content}</p>
                </div>
                <div> <p>por <span id="review-author" class="highlight-word">${review.author}</span></p>
                    <div class="footer-info">
                        <span id="review-date" class="left-aligned-text">${new Date(review.updated_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <span class="right-aligned-text">Nota: <span id="review-rate" class="highlight-word">${review.author_details.rating}</span>/10</span>
                    </div>
                </div>
            `;
            
            reviewsContainer.appendChild(reviewCard);
        });
    } else {
        reviewsContainer.innerHTML = '<p>Nenhuma resenha encontrada para este filme.</p>';
    }

    //VIDEOS//
    videoContainer.innerHTML = "";

    if (videosData.results && videosData.results.length >0) {

        const trailers = videosData.results.filter(video => video.type === 'Trailer' && video.site === 'YouTube');

        videoCount.textContent = trailers.length;

        if (trailers.length > 0) {
            
            const videosLimitados = trailers.slice(0, 3);

            videosLimitados.forEach(video => {
                const videoCard = document.createElement('div');
                videoCard.classList.add('video-card');

                videoCard.dataset.videoKey = video.key;

                videoCard.innerHTML = `<img src="https://img.youtube.com/vi/${video.key}/mqdefault.jpg" alt="${video.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">`;

                videoCard.addEventListener('click', function() {
                    const key = this.dataset.videoKey;
                    // Ao clicar, substitui a miniatura pelo player do YouTube
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
                }, { once: true });

                videoContainer.appendChild(videoCard);
            });
        } else {
            videoContainer.innerHTML = '<p>Nenhum trailer encontrado para este filme.</p>';
        }
    } else {
        videoContainer.innerHTML = '<p>Nenhum vídeo encontrado para este filme.</p>';
    }

    //POSTERS//
    posterImagesContainer.innerHTML = "";

    if (imagesData.posters && imagesData.posters.length > 0) {
        const posterImagesLimitados = imagesData.posters.slice(0, 4);

        postersCount.textContent = imagesData.posters.length;

        posterImagesLimitados.forEach(posterImage => {
            const posterImageCard = document.createElement('div');
            posterImageCard.classList.add('poster-box');

            const posterUrl = `https://image.tmdb.org/t/p/w500${posterImage.file_path}`;
            posterImageCard.style.backgroundImage = `url(${posterUrl})`;

            posterImagesContainer.appendChild(posterImageCard);
        });
    } else {
        posterImagesContainer.innerHTML = '<p>Nenhum poster encontrado para este filme.</p>';
    }

    //WALLPAPERS//
    wallpapersContainer.innerHTML = "";

    if (imagesData.backdrops && imagesData.backdrops.length > 0) {
        const wallpapersLimitados = imagesData.backdrops.slice(0, 2);

        wallpaperCount.textContent = imagesData.backdrops.length;

        wallpapersLimitados.forEach(wallpaper => {
            const wallpaperCard = document.createElement('div');
            wallpaperCard.classList.add('wallpaper-box');

            const wallpaperUrl = `https://image.tmdb.org/t/p/w500${wallpaper.file_path}`;
            wallpaperCard.style.backgroundImage = `url(${wallpaperUrl})`;

            wallpapersContainer.appendChild(wallpaperCard);
        });
    } else {
        wallpapersContainer.innerHTML = '<p>Nenhuma imagem de fundo encontrada para este filme.</p>';
    }

    //RECOMMENDATIONS//
    recommendationsContainer.innerHTML = "";

    if (recommendationsData.results && recommendationsData.results.length > 0) {
        const recLimitadas = recommendationsData.results.slice(0, 6);

        recLimitadas.forEach(rec => {
            const recCard = document.createElement('div');
            recCard.classList.add('rec-card');

            recCard.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${rec.poster_path}" alt="${rec.title}">
                <h4>${rec.title}</h4>
                <p>${(rec.vote_average * 10).toFixed(2)}%</p>
            `;
            
            recommendationsContainer.appendChild(recCard);
        });
    } else {
        recommendationsContainer.innerHTML = '<p>Nenhuma recomendação encontrada com base neste filme.</p>';
    }
    
  })
  .catch(err => console.error("Ocorreu um erro:", err));