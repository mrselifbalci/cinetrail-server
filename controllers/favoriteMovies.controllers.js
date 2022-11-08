const FavoriteMoviesModel = require('../models/FavoriteMovies.model');
const UserModel = require('../models/Users.model');
const MoviesModel = require('../models/Movies.model');
const mongoose = require('mongoose');
require('dotenv').config();
const axios = require("axios");

 
exports.getAllFavoriteMovies = async (req, res) => {
	const{page=1,limit=10}=req.query
	const total = await FavoriteMoviesModel.find().countDocuments();
	await FavoriteMoviesModel.aggregate(
	[
		{
			$sort:
			{
			 createdAt: -1 
			} 
		},
		{
			 $skip:(page - 1) * limit 
		},
		{
			 $limit:limit*1 
		},   
		{
			$project:{
				movie_id:true,user_id:true,tmdb_id:true,createdAt:true,updatedAt:true
			}
		},
	],
	(err,data)=>{
	if(err)res.json(err);
	const pages = limit === undefined ? 1 : Math.ceil(total / limit);
	res.json({ total,pages, status: 200, data })
}) 
};


  
exports.getFavoriteMoviesByUserId = async (req, res) => {  
	console.log(req.params.userid)
	if(!req.params.userid || req.params.userid==="undefined"){
		return;
	}else{
		await FavoriteMoviesModel.aggregate(
			[
				{
					$match: { user_id: mongoose.Types.ObjectId(req.params.userid) }
				},
				{
					$sort:
					{
					 createdAt: -1
					} 
				}, 
				{ 
				$lookup:{  
					from:'movies',
					let:{"movie_id":"$movie_id"},
					pipeline:[
						{$match:{$expr:{$eq:["$_id","$$movie_id"]}}},
						{$project:{
							backdrop_path:1,
	
							poster_path:1,
							budget:1,
							genres:1,
							tmdb_id:1,
							title:1,
							overview:1,
							release_date:1,
							runtime:1,
							status:1,
							tagline:1,
							vote_average:1
						}},
					],
					as:'movie' 
				} 
				},
				{
					$project:{
						movie:true,_id:false
					}
				},
			],
			(err,favorites)=>{ 
			if(err)res.json(err);
			res.json({favorites})
		}) 
	}
	

};





exports.createFavoriteMovie = async (req, res) => {
	console.log(req.body)
	const { movie_id, user_id} = req.body;  
	if(user_id && movie_id){
		await FavoriteMoviesModel.find({tmdb_id:req.body.movie_id,user_id:req.body.user_id}) 
		.then(async data=>{ 
			if(data.length>0){ 
				res.json({status:409,message:"This user already has this movie in the favorites list."})
			}else{ 
				await MoviesModel.find({tmdb_id:req.body.movie_id})
				.then( async movie=>{
					if(movie.length>0){
						const newFavorite = await new FavoriteMoviesModel({
							movie_id:movie[0]._id,
							user_id:user_id,
							tmdb_id:movie_id
						})
						newFavorite
							.save()
							.then(favorite =>
								res.json({
									status: 200,
									message: 'New favorite movie created successfully.',
									favorite,
								})
							
							)
							.catch((error) => res.json(err));
					}else{
						axios.get(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=${process.env.API_KEY}&language=en-US`)
				    .then(async response=>{
					const newMovie= await new MoviesModel({
						backdrop_path:response.data.backdrop_path,
						poster_path:response.data.poster_path,
						budget:response.data.budget,
						genres:response.data.genres,
						tmdb_id:movie_id,
						title:response.data.title,
						overview:response.data.overview,
						release_date:response.data.release_date,
						runtime:response.data.runtime,
						status:response.data.status,
						tagline:response.data.tagline,
						vote_average:response.data.vote_average
					})
					newMovie.save()
					.then(async movie=>{
						const newFavorite = await new FavoriteMoviesModel({
							movie_id:movie._id,
							user_id:user_id,
							tmdb_id:movie_id
						})
						newFavorite
							.save()
							.then(favorite =>
								res.json({
									status: 200,
									message: 'New favorite movie created successfully.',
									favorite,
								})
							
							)
							.catch((error) => res.json(err));
					})
					.catch(err=>res.json(err))

				})
				.catch(err=>res.json(err))
				}
				}).catch((error) => movie.json(error));
			}
		}).catch(err=>res.json(err))
	}else{
		res.json({status:400,message:"Provide both the movie id and user id"})
	}

};

 
exports.checkExistence = async (req, res, next) => {
			try {
				const response = await FavoriteMoviesModel.findOne({ "user_id": req.body.user_id,"tmdb_id":req.body.tmdb_id} )
				res.json(response)
				 
			} catch (error) {
				next({ status: 404, message: error });
			}   
};
  
 

exports.updateFavoriteMovie = async (req, res) => {
	await FavoriteMoviesModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
		.then((data) => res.json({ message: 'Successfully updated', data }))
		.catch((err) => res.json({ message: err })); 
};

 
exports.deleteFavoriteMovie = async (req, res) => { 
	await FavoriteMoviesModel.findOneAndDelete({tmdb_id:req.params.tmdb_id,user_id:req.params.user_id}) 
	.then(response=>res.json({status:200,message:"removed from favorites"}))
	.catch((err) => res.json({ err })); 
};
 
