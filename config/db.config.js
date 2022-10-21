require('dotenv').config();
const mongoose = require('mongoose');
const port = process.env.PORT
module.exports = () => {
	mongoose.connect(process.env.db_connection, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
	mongoose.connection.on('open', () => {
		console.log(`DB connection established at http://localhost:${port}`);
	});

	mongoose.connection.on('error', (err) => {
		console.log('Connection failed' + err);
	});
};
