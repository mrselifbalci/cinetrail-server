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
    // const newMovie = await new MoviesModel({
    //     name: req.body.name,
	// 	universities:req.body.universities,
	// 	student_life:req.body.student_life,
	// 	image_url: req.body.image_url,
    // })

    // newMovie.save((err, data) => {
    //     if(err) {
    //         res.status(500).json({message: err})
    //     } else {
    //         res.status(200).json({
    //             message: 'new movie created',
    //             data
    //         })
    //     }
    // })

}



exports.getSingleMovie = async (req, res) => {

	await MoviesModel.aggregate(
		[
			{
				$match: { _id: mongoose.Types.ObjectId(req.params.id) }
			},
			{$sort:{createdAt: -1} },
			{
			   $lookup:{
				   from:'properties',
				   localField:"_id",
				   foreignField:'city_id',
				   as:'property_count'
			   }, 
			   
		   }, 
		   {
			   $addFields: { property_count: { $size: "$property_count" } }  
		   },
		   {
			   $project:{
				   name:true,universities:true,student_life:true,image_url:true,property_count:true,
				   createdAt:true,updatedAt:true
			   } 
		   },
		],
		(err,data)=>{ 
			if(err)res.json(err);
			res.json({data})
		})
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