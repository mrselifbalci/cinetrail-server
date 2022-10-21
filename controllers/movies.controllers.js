const mongoose = require('mongoose')
const MoviesModel = require('../models/Movies.model')

exports.getAllMovies = async (req, res, next) => { 
	try {
		const { page = 1, limit } = req.query;
		const response = await MoviesModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit) 
			.sort({ createdAt: -1 })
		const total = await MoviesModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total, pages, status: 200, response });
	} catch (error) {
		res.json({ status: 404, message: err });
	}
}

exports.create = async (req, res) => {

	console.log(req.body)
    

}



exports.getSingleMovie = async (req, res) => {

console.log(req.body)
}


exports.updateMovie = async (req, res) => {
    await MoviesModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
    .then((data) => res.json({ message: 'Successfully updated', data }))
    .catch((err) => res.json({ message: err }));
}

exports.deleteMovie = async (req, res) => {
    await MoviesModel.findByIdAndDelete({ _id: req.params.id })
	.then((data) => res.json(data))
	.catch((err) => res.json({ message: err }));
}