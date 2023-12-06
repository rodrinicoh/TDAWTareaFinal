


const express = require('express');
const https = require('https');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3002;

// MongoDB Connection URI and Database Name
const mongoURI = 'mongodb://mongodb:27017/MyMovies'; // Replace with your MongoDB URI
const dbName = 'MyMovies'; // Replace with your database name
const collectionName = 'MyMovies'; // Replace with your collection name

// Enable CORS for all routes
app.use(cors());

// Connect to MongoDB and get a random movie ID
async function getRandomMovieId() {
  const client = await MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  const allIds = await collection.find({}, { projection: { _id: 0, id: 1 } }).toArray();
  const randomId = allIds[Math.floor(Math.random() * allIds.length)].id;

  client.close();
  return randomId;
}

// Endpoint to fetch specific movie details from TMDB based on a random ID from MongoDB
app.get('/random-movie', async (req, res) => {
  try {
    const apiKey = 'eaaa5eef25d43f878e3792520562addb'; // Replace with your TMDB API key

    const randomMovieId = await getRandomMovieId();
    const url = `https://api.themoviedb.org/3/movie/${randomMovieId}?api_key=${apiKey}&language=en-US`;

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
