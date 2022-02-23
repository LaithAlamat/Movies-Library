"use strict";

const express = require("express");
const moviesData = require("./Data/data.json");
const app = express();
const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();

const pg = require("pg");
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);
app.use(express.json());

const APIKEY = process.env.APIKEY;
const PORT = process.env.PORT;

function MoviesLibrary(id, title, release_date, poster_path, overview) {
  this.id = id;
  this.title = title;
  this.release_date = release_date;
  this.poster_path = poster_path;
  this.overview = overview;
}

client.connect()
.then(() =>{
app.listen(`${PORT}`, () => {
  console.log(`Listen on ${PORT}`);
  });
});



let homePageHandler = (req, res) => {
  let moviesLibray = [];
  moviesData.data.forEach((movie) => {
    movie = new MoviesLibrary(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview);
    moviesLibray.push(movie);
  });
  return res.status(200).json(moviesLibray);
};

app.get("/", homePageHandler);

let favoritePageHandler = (req, res) => {
  return res.status(200).send("Welcome to Favorite Page");
};

app.get("/favorite", favoritePageHandler);

let trendingPageHandler = (req, res) => {
  let trendingMovies = [];
  axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}&language=en-US`)
    .then((value) => {
      value.data.results.forEach((movie) => {
        movie = new MoviesLibrary(
          movie.id,
          movie.title,
          movie.release_date,
          movie.poster_path,
          movie.overview
        );
        trendingMovies.push(movie);
      });
      return res.status(200).json(trendingMovies);
    });
};

app.get("/trending", trendingPageHandler);

let topRatedPageHandler = (req, res) => {
  let topRated = [];
  axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${APIKEY}&language=en-US&page=1`)
    .then((value) => {
      value.data.results.forEach((movie) => {
        movie = new MoviesLibrary(
          movie.id,
          movie.title,
          movie.release_date,
          movie.poster_path,
          movie.overview
        );
        topRated.push(movie);
      });
      return res.status(200).json(topRated);
    });
};

app.get("/topRated", topRatedPageHandler);

let upcomingPageHandler = (req, res) => {
  let upcoming = [];
  axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${APIKEY}&language=en-US&page=1`)
    .then((value) => {
      value.data.results.forEach((movie) => {
        movie = new MoviesLibrary(
          movie.id,
          movie.title,
          movie.release_date,
          movie.poster_path,
          movie.overview
        );
        upcoming.push(movie);
      });
      return res.status(200).json(upcoming);
    });
};

app.get("/upcoming", upcomingPageHandler);

let searchPageHandler = (req, res) => {
  let searchQuery = req.query.search;
  console.log(req.query.search);
  let searchResults = [];

  axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&language=en-US&query=${searchQuery}`)
    .then((value) => {
      value.data.results.forEach((movie) => {
        movie = new MoviesLibrary(
          movie.id,
          movie.title,
          movie.release_date,
          movie.poster_path,
          movie.overview
        );
        searchResults.push(movie);
      });
      return res.status(200).json(searchResults);
    });
};

app.get("/search", searchPageHandler);

function addMovieHandler (req, res) {
  let movie = req.body;
  let sql = `INSERT INTO movies(title, release_date, poster_path, overview, comment) VALUES($1, $2, $3, $4, $5) RETURNING *`;
  let values = [movie.title,movie.release_date, movie.poster_path, movie.overview, movie.comment];


  client.query(sql, values).then((data) => {
    console.log(data);
    return res.status(201).json(data.rows);
  });
};

app.post("/addMovie", addMovieHandler);

function getMoviesHandler(req, res) {
  let id = req.params.id;
  let sql = `SELECT * FROM movies WHERE id=$1;`;
  client.query(sql).then((data) => {
    res.status(200).json(data.rows);
  });
}

app.get("/getMovies/:id", getMoviesHandler);

function updateMovieCommentHandler(req, res) {
  const id = req.params.id;
  const movie = req.body;

  const sql = `UPDATE movies SET comment=$1 WHERE id=$2 RETURNING *;`;
  const values = [movie.comment];

  client.query(sql, values).then((data) => {
    return res.status(200).json(data.rows);
  });
}
  app.put("/updateMovieComment/:id", updateMovieCommentHandler);

  function deleteMovieHandler(req, res) {
    const  id  = req.params.id;
    console.log(id);
    const sql = `DELETE FROM movies WHERE id=$1;`;
  
    client.query(sql).then(() => {
      return res.status(204).json([]);
    });
  }
  app.delete("/deleteMovie/:id", deleteMovieHandler);


let pageNotFoundHandler = (req, res) => {
  res.send({
    status: 404,
    responseText: "Page not found.",
  });
};


app.get("*", pageNotFoundHandler);

