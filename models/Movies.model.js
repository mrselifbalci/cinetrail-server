const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MoviesSchema = new Schema({
    backdrop_path: {type: String},
    poster_path:{type: String},
    budget:{type: Number},
    genres:{type: Array},
    tmdb_id:{type: String},
    title:{type: String},
    overview:{type: String},
    release_date:{type: String},
    runtime:{type: Number},
    status:{type: String},
    tagline:{type: String},
    vote_average:{type: Number}
},{timestamps:true})

module.exports = mongoose.model('movie', MoviesSchema)