const express = require('express');
const https = require('https');
const cors = require('cors');

const app = express();
const port = 3004;

// Enable CORS for all routes
app.use(cors());

// Endpoint to fetch specific movie details from TMDB based on ID
app.get('/info/:id', async (req, res) => {
  try {
    const apiKey = 'eaaa5eef25d43f878e3792520562addb'; // Replace with your TMDB API key
    const movieId = req.params.id; // Get movie ID from the URL parameter

    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;

    // Fetching movie details from TMDB using 'https' module
    https.get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        const movieData = JSON.parse(data);

        const {
          title,
          release_date,
          vote_average,
          overview,
          poster_path
        } = movieData;

        res.json({
          title,
          release_date,
          vote_average,
          overview,
          poster_path,
          favorite: false // You can set the default value for favorite
        });
      });
    }).on('error', (error) => {
      console.error('Error:', error);
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
