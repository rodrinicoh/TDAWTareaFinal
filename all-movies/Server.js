const express = require('express');
const { MongoClient } = require('mongodb');
const https = require('https');
const cors = require('cors');

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

// Connection URI and Database Name
const uri = 'mongodb://mongodb:27017/MyMovies'; // Replace with your MongoDB URI
const dbName = 'MyMovies'; // Replace with your database name
const collectionName = 'MyMovies'; // Replace with your collection name
const apiKey = 'eaaa5eef25d43f878e3792520562addb'; // Replace with your TMDB API key

// Endpoint to fetch all movies with TMDB details
app.get('/all-movies', async (req, res) => {
  try {
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const movies = await collection.find({}).toArray();

    // Array to hold movie details from TMDB
    const moviesWithTMDBDetails = [];

    for (const movie of movies) {
      const movieId = movie.id;
      const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;

      // Fetching movie details from TMDB using 'https' module
      const movieDetails = await new Promise((resolve, reject) => {
        https.get(url, (response) => {
          let data = '';

          response.on('data', (chunk) => {
            data += chunk;
          });

          response.on('end', () => {
            const movieData = JSON.parse(data);
            resolve(movieData);
          });
        }).on('error', (error) => {
          console.error('Error:', error);
          reject(error);
        });
      });
      moviesWithTMDBDetails.push({
        title: movieDetails.title,
        release_date: movieDetails.release_date,
        vote_average: movieDetails.vote_average,
        overview: movieDetails.overview,
        favorite: movie.favorite
      });
    }
    res.json(moviesWithTMDBDetails);
    res.set('Content-Type', 'text/plain');
    res.send(200, result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
