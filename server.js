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
const { Track } = require("./models/track");
const { Playlist } = require("./models/playlist");


const { check, validationResult } = require('express-validator')

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

// search tracks by one keyword (artist genre title)
// /public/tracks?keyword=xxx
app.get("/public/tracks", [check('keyword').isLength({ max: 50 }).trim()], (req, res) => {
    const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}

    const keyword = req.query.keyword.toString()
    log(keyword)
    Track.find({$or:[
        {"artist_name" : {$regex : keyword, $options: "ix"}},
        {"track_genres" : {$regex : keyword, $options: "ix"}},
        {"track_title" : {$regex : keyword, $options: "ix"}}
    ]}).then(
        tracks => {
            res.send({ tracks });
        },
        error => {
            log(error)
            res.status(500).send(error); // server error
        }
    );
});

// get all track lists created by a user
app.get('/playlist/:id', (req, res) => {
	// const lists = trackLstDB.all()
	// log(Object.keys(lists))
	// res.status(200).send({ lists })
})

// create a new playlist by a user
app.post('/playlist', (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}
    log(req.body)

    const newList = new Playlist({
        listname: req.body.listname.toString(),
        username: req.body.username.toString(),
        lastModifiedTime: new Date()
    });
    let totalPlaytime = '00:00'
    const tracklist = []
	req.body.tracks.forEach(id => {
        // find track by id
        log('trackid: ' + id)
		Track.findOne({ track_id: id.toString() })
            .then(track => {
                if (!track) {
                    res.status(404).send(); // could not find this student
                } else {
                    tracklist.push(track)
                    totalPlaytime = convertToSeconds(track.track_duration) + convertToSeconds(newList.totalPlaytime)
                    totalPlaytime = convertToDuration(totalPlaytime)
                }
            })
            .catch(error => {
                log(error)
                res.status(500).send(); // server error
            });
	})
    newList.tracks = tracklist
    newList.totalPlaytime = totalPlaytime
    newList.save().then(
        result => {
            res.send(result);
        },
        error => {
            res.status(400).send(error); // 400 for bad request
        }
    );
})


/*** Helper Functions ************************************/
function updateUserPlayListID(){

}


function convertToSeconds(duration) {
	const time = duration.split(":")
	var hour = 0
	var min = 0
	var sec = 0
	if(time.length === 3) {
		hour = parseInt(time[0])
		min = parseInt(time[1])
		sec = parseInt(time[2])
	} else if(time.length == 2){
		min = parseInt(time[0])
		sec = parseInt(time[1])
	}
	return hour * 3600 + min * 60 + sec
}

function convertToDuration(seconds){
	var hour = 0
	var min = 0
	var sec = 0
	if (seconds < 60) {
		if (sec < 10) {
			sec = `0${sec}`
		}
		return `00:${seconds}`
	}
	if (seconds >= 60) {
		min = parseInt(seconds / 60)
		sec = seconds - (min * 60)
		if (min >= 60) {
			hour = parseInt(min / 60)
			min = min - hour * 60
			if (hour < 10) {
				hour = `0${hour}`
			}
			if (min < 10) {
				min = `0${min}`
			}
			if (sec < 10) {
				sec = `0${sec}`
			}
			return `${hour}:${min}:${sec}`
		} else {
			if (min < 10) {
				min = `0${min}`
			}
			if (sec < 10) {
				sec = `0${sec}`
			}
			return `${min}:${sec}`
		}
	}
}

/*************************************************/
// Express server listening...
const port = process.env.PORT || 5000
app.listen(port, () => {
	log(`Listening on port ${port}...`)
}) 
