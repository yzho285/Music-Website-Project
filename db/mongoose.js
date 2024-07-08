// This module will hold our connection to our mongo server
const mongoose = require('mongoose')

// Connnect to our database
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://ece9065lab4:admin@ece9065lab4.pqa2q5u.mongodb.net/lab4'

mongoose.connect(mongoURI, 
	{ useNewUrlParser: true })
	.catch((error) => { 
		console.log('Error connecting to mongodb. Timeout reached.') 
		console.log(error)
	})
;

mongoose.connection.once('open', () => console.log('Connected to Database'))
module.exports = { mongoose }  // Export the active connection.