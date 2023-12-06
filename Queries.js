document.getElementById('getRandom').addEventListener('click', () => {
    fetch('http://localhost:3002/random-movie') // Endpoint for random movie
      .then(response => response.json())
      .then(data => {
        const movieByIdContainer = document.getElementById('movieContainer');
        movieByIdContainer.innerHTML = '<h2>Movie Information by ID</h2>';
        movieByIdContainer.innerHTML += `
          <h3>${data.title}</h3>
          <p>Overview: ${data.overview}</p>
          <p>Release Date: ${data.release_date}</p>
          <p>Vote Average: ${data.vote_average}</p>
          <img src="https://image.tmdb.org/t/p/w500/${data.poster_path}" alt="${data.title} Poster">
        `;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
  
  document.getElementById('getAll').addEventListener('click', () => {
    fetch('http://localhost:3001/all-movies') // Endpoint for all movies
      .then(response => response.json())
      .then(data => {
        const movieContainer = document.getElementById('movieContainer');
        movieContainer.innerHTML = '<h2>All TMDB Movies Info</h2>';
        
        // Loop through each movie in the data array
        data.forEach(movie => {
          movieContainer.innerHTML += `
            <div>
              <h3>${movie.title}</h3>
              <p>Overview: ${movie.overview}</p>
              <p>Release Date: ${movie.release_date}</p>
              <p>Vote Average: ${movie.vote_average}</p>
              <p>Favorite: ${movie.favorite}</p>
            </div>
            <hr>
          `;
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
  
  document.getElementById('getFavorites').addEventListener('click', () => {
    fetch('http://localhost:3003/favorite-movies') // Endpoint for favorite movies
      .then(response => response.json())
      .then(data => {
        const movieContainer = document.getElementById('movieContainer');
        movieContainer.innerHTML = '<h2>All TMDB Movies Info</h2>';
        
        // Loop through each movie in the data array
        data.forEach(movie => {
          movieContainer.innerHTML += `
            <div>
              <h3>${movie.title}</h3>
              <p>Overview: ${movie.overview}</p>
              <p>Release Date: ${movie.release_date}</p>
              <p>Vote Average: ${movie.vote_average}</p>
            </div>
            <hr>
          `;
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
  
  document.getElementById('getMovieById').addEventListener('click', () => {
    const movieId = document.getElementById('movieId').value.trim();
    if (!movieId) {
      alert('Please enter a movie ID.');
      return;
    }
  
    fetch(`http://localhost:3004/info/${movieId}`) // Endpoint for specific TMDB movie info
      .then(response => response.json())
      .then(data => {
        const movieByIdContainer = document.getElementById('movieContainer');
        movieByIdContainer.innerHTML = '<h2>Movie Information by ID</h2>';
        movieByIdContainer.innerHTML += `
          <h3>${data.title}</h3>
          <p>Overview: ${data.overview}</p>
          <p>Release Date: ${data.release_date}</p>
          <p>Vote Average: ${data.vote_average}</p>
          <img src="https://image.tmdb.org/t/p/w500/${data.poster_path}" alt="${data.title} Poster">
        `;
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error fetching movie information. Please try again.');
      });
  });
  