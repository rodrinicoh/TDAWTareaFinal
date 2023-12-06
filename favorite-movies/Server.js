const express = require('express');
const { MongoClient } = require('mongodb');
const https = require('https');
const cors = require('cors');

const app = express();
const port = 3003;

// Connection URI and Database Name
const uri = 'mongodb://mongodb:27017/MyMovies'; // Replace with your MongoDB URI
const dbName = 'MyMovies'; // Replace with your database name
const collectionName = 'MyMovies'; // Replace with your collection name

// Replace this with your TMDB API key
const apiKey = 'eaaa5eef25d43f878e3792520562addb';

// Enable CORS for all routes
app.use(cors());

app.get('/favorite-movies', async (req, res) => {
  try {
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Find all favorited movies from the database
    const favoriteMovies = await collection.find({ favorite: true }).toArray();

    // Fetch movie details from TMDB using IDs obtained from the database
    const promises = favoriteMovies.map(async (movie) => {
      const movieId = movie.id;
      const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;
      
      return new Promise((resolve, reject) => {
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
          console.error('Error fetching movie:', error);
          reject(error);
        });
      });
    });

    // Wait for all API requests to resolve
    const moviesInfo = await Promise.all(promises);
    res.json(moviesInfo);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
