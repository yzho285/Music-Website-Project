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
const { Genre } = require('./models/genre')
const { User } = require("./models/user");

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require('body-parser') 
app.use(bodyParser.json())

/*** Webpage routes below **********************************/
// route for root
// Serve the build
app.use(express.static(__dirname + "/client/dist/lab4-app"));
app.get('/', (req, res) => {
    // send index.html
    res.sendFile(__dirname + "/client/dist/lab4-app/index.html");
})
/*************************************************/

/*** User Authentication Routes below ************************************/
// create a new user
app.post("/users/signup", (req, res) => {
    log(req.body);

    // Create a new user
    const user = new User({
        email: req.body.email,
        password: req.body.password,
        userName: req.body.userName,
		role: req.body.role,
		activate: req.body.activate,
		playlists: [],
		reviews: []
    });

    // Save the user
    user.save().then(
        user => {
            res.send(user)
        },
        error => {
            res.status(400).send(error)
        }
    );
});

// express-session for managing user sessions
const session = require("express-session");
app.use(bodyParser.urlencoded({ extended: true }));

// Create a session cookie
app.use(
    session({
        secret: "oursecret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60000,
            httpOnly: true
        }
    })
);

// user login
app.post("/users/login", (req, res) => {
    const email = req.body.email
    const password = req.body.password
    log(email, password)
    // find the user by email
    User.findByEmailPassword(email, password)
        .then(user => {
			req.session.user = user._id;
            req.session.email = user.email;
            res.send({ currentUser: user.email, id: user._id, userName: user.userName });
        })
        .catch(error => {
            res.status(400).send()
        });
});


// logout a user
app.get("/users/logout", (req, res) => {
    // Remove the session
    req.session.destroy(error => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.send()
        }
    });
});

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
            res.send({ students });
        },
        error => {
            res.status(500).send(error); // server error
        }
    );
});


// Get all genres
app.get("/genres", (req, res) => {
    Genre.find().then(
        genres => {
            log();
            res.send({ genres });
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

