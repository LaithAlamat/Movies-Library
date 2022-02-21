"use strict";

const express = require("express");
const moviesData = require("./Data/data.json");
const app = express();
const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();
const APIKEY = process.env.APIKEY;
const PORT = process.env.PORT;

function MoviesLibrary(id, title, release_date, poster_path, overview) {
  this.id = id;
  this.title = title;
  this.release_date = release_date;
  this.poster_path = poster_path;
  this.overview = overview;
}

app.listen(`${PORT}`, () => {
  console.log(`Listen on ${PORT}`);
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


let pageNotFoundHandler = (req, res) => {
  res.send({
    status: 404,
    responseText: "Page not found.",
  });
};

app.get("*", pageNotFoundHandler);
