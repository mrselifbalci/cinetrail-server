const express = require('express')
const router = express.Router()


const movieController = require('../controllers/movies.controllers')

router.get('/movies', movieController.getAllMovies)
router.get('/movies/:id', movieController.getSingleMovie)
router.post('/movies', movieController.create)
router.patch('/movies/:id', movieController.updateMovie)
router.delete('/movies/:id', movieController.deleteMovie)
 

module.exports = router 