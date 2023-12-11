const express = require('express');
const https = require('https');
const cors = require('cors');

const app = express();
const port = 3003;

const SESSION_ID = '0f783dc54c8e49d5d25239e36506d46d059773b4';
// Replace this with your TMDB API key
const apiKey = 'eaaa5eef25d43f878e3792520562addb';

// Enable CORS for all routes
app.use(cors());

app.get('/favorite-movies', async (req, res) => {
  try {
    const url = `https://api.themoviedb.org/3/account/1/favorite/movies?sort_by=created_at.desc&api_key=${apiKey}&session_id=${SESSION_ID}`;

    https.get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const movieData = JSON.parse(data);
          if (movieData.results && movieData.results.length > 0) {
            const movies = movieData.results.map((movie) => {
              const {
                title,
                release_date,
                vote_average,
                overview,
                poster_path
              } = movie;
              return {
                title,
                release_date,
                vote_average,
                overview,
                poster_path
              };
            });
            res.json(movies); // Return the array containing all favorited movies
          } else {
            res.status(404).json({ error: 'No favorite movies found' });
          }
        } catch (error) {
          console.error('Error parsing movie data:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });
    }).on('error', (error) => {
      console.error('Error fetching movies:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
