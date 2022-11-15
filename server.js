/* server.js, with mongodb API and static directories */
'use strict';
const log = console.log
const path = require('path')

const express = require('express')
// starting the express server
const app = express();

const cors = require('cors')
app.use(cors())

// mongoose and mongo connection
const { mongoose } = require('./db/mongoose')
// don't buffer db requests if the db server isn't connected 
// minimizes http requests hanging if this is the case.
mongoose.set('bufferCommands', false);  

// import the mongoose models
const { Student } = require('./models/student')

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require('body-parser') 
app.use(bodyParser.json())

/*** Webpage routes below **********************************/

// // static js directory
// app.use("/js", express.static(path.join(__dirname, '/public/js')))

// route for root
// Serve the build
app.use(express.static(__dirname + "/client/dist/lab4-app"));
app.get('/', (req, res) => {
    // send index.html
    res.sendFile(__dirname + "/client/dist/lab4-app/index.html");
})
/*************************************************/
/*** API Routes below ************************************/
// a POST route to *create* a student example 
app.post('/students', (req, res) => {
	log(req.body)

	// check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}  

	// Create a new student using the Student mongoose model
	const student = new Student({
		name: req.body.name,
		year: req.body.year
	})

	// Save student to the database
	student.save().then((result) => {
		res.send(result)
	}).catch((error) => {
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			log(error) // log server error to the console, not to the client.
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	})
})



// a GET route to get all students
app.get("/students", (req, res) => {
    Student.find().then(
        students => {
            log();
            res.send({ students }); // can wrap in object if want to add more properties
        },
        error => {
            res.status(500).send(error); // server error
        }
    );
});



/*************************************************/
// Express server listening...
const port = process.env.PORT || 5000
app.listen(port, () => {
	log(`Listening on port ${port}...`)
}) 

