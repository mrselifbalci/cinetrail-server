const express = require('express');
const router = express.Router();
const favoriteMoviesControllers = require('../controllers/favoriteMovies.controllers');

router.get('/favoriteMovies', favoriteMoviesControllers.getAllFavoriteMovies);
router.get('/favoriteMovies/user/:userid', favoriteMoviesControllers.getFavoriteMoviesByUserId); 
router.post('/favoriteMovies/search', favoriteMoviesControllers.checkExistence);
router.post('/favoriteMovies', favoriteMoviesControllers.createFavoriteMovie);
router.patch('/favoriteMovies/:id', favoriteMoviesControllers.updateFavoriteMovie);
router.delete('/favoriteMovies/:user_id/:tmdb_id', favoriteMoviesControllers.deleteFavoriteMovie); 
 
module.exports = router;        