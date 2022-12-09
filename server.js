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
const { Genre } = require('./models/genre')
const { User } = require("./models/user");
const { Track } = require("./models/track");
const { Playlist } = require("./models/playlist");
const { Message } = require("./models/message");
const { Policy } = require("./models/policy");



const { check, validationResult } = require('express-validator')

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require('body-parser') 
app.use(bodyParser.json())

// jwt
const jsonwebtoken = require('jsonwebtoken')
const expressJWT = require('express-jwt')
// const { expressjwt: jwt } = require("express-jwt");
// var { expressjwt: jwt } = require("express-jwt");

const secretKey = 'IloveECE9065!!!'
// decode jwt token
app.use(expressJWT({ secret: secretKey, algorithms: ['HS256'] }).unless({
    path: [
        '/users/signup',
        '/users/login',
        '/users/logout',
        '/genres', 
        '/public/playlists',
        '/public/tracks',
        '/confirmation',
        '/admin/policy',
        '/admin/message',
        /^\/confirmation\/.*/
    ]
}))

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
            user = {
                // userName: user.userName,
                // role: user.role,
                // activate: user.activate,
                // email: user.email,
                id: user._id
            }
            res.setHeader("Access-Control-Expose-Headers", "Authorization")
            res.send({ user })
        },
        error => {
            res.status(400).send(error)
        }
    );
});


app.get("/confirmation", (req, res) => {
    log('userid: ' + req.query.userid)
    User.findByIdAndUpdate(req.query.userid.toString(), {verify: '1'}, {new: true})
        .then(user => {
            if (!user) {
                log('404')
                res.status(404).send('User does not exist')
            } else {
                const token = jsonwebtoken.sign(user.toJSON(), secretKey, {
                    expiresIn: "1h",
                 });
                 user = {
                    currentUser: user.email, 
                    id: user._id, 
                    userName: user.userName, 
                    role: user.role
                }
                res.status(200).send({ user, token })
            }
        })
        .catch(error => {
            log(error)
            res.status(401).send()
        });
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
            if (user.activate === '0') {
                res.status(400).send('Login Failed, User has been marked as deactivate user.')
            } else {
                req.session.user = user._id;
                req.session.email = user.email;
                const token = jsonwebtoken.sign(user.toJSON(), secretKey, {
                    expiresIn: "1h",
                 });
                 user = {
                    currentUser: user.email, 
                    id: user._id, 
                    userName: user.userName, 
                    role: user.role, 
                    verify: user.verify,
                 }
                 res.status(200).send({ user, token});
            }
        })
        .catch(error => {
            res.status(401).send()
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

// update password of a user
app.post("/password/update", (req, res) => {
    log('new: ' + req.body.newpassword)
    const userid = req.body.userid.toString()
    const newpassword = req.body.newpassword.toString()

    // Update the user password by their id.
    User.findById(userid)
        .then(user => {
            if (!user) {
                res.status(404).send('User does not exist');
            } else {
                user.password = newpassword
                user.save().then(
                    user => {
                        log('update password success')
                        res.send(user);
                    },
                    error => {
                        log(error)
                        res.status(400).send(error); // 400 for bad request
                    }
                );
            }
        })
        .catch(error => {
            log(error)
            res.status(400).send(); // bad request for changing the student.
        });
});

// deactivate a user
app.post("/admin/deactivate", (req, res) => {
    log(req.body)
    const userid = req.body.userid.toString()
    User.findById(userid)
        .then(user => {
            if (!user) {
                res.status(404).send('User does not exist');
            } else {
                if (user.role !== '1') {
                    res.status(403).send('You are not a Admin')
                }
            }
        })
        .catch(error => {
            log(error)
            res.status(400).send(); // bad request for changing the student.
        });

    const activate = req.body.status.toString()
    const email = req.body.email.toString()

    // Update the user password by their id.
    User.findOneAndUpdate({ email: email }, { activate: activate }, { new: true })
        .then(user => {
            if (!user) {
                res.status(404).send('User does not exist');
            } else {
                log('User deactivate success')
                res.send(user)
            }
        })
        .catch(error => {
            log(error)
            res.status(400).send(); // bad request for changing the student.
        });
});

// Grant admin privilege to a user
// role 1 admin, 2 user
app.post("/admin/user/upgrade", (req, res) => {
    const email = req.body.email.toString()
    const role = req.body.role.toString()
    const userid = req.body.userid.toString()
    log(req.body)

    User.findById(userid)
        .then(user => {
            if (!user) {
                res.status(404).send('User does not exist');
            } else {
                if (user.role !== '1') {
                    res.status(403).send('You are not a Admin')
                }
            }
        })
        .catch(error => {
            log(error)
            res.status(400).send(); // bad request for changing the student.
        });

    // Update the user password by their id.
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                res.status(404).send('User does not exist');
            } else {
                user.role = role
                user.userName = user.userName + '(Admin)'
                user.save().then(
                    result => {
                        log('User upgrades to admin success')
                        res.send(user)
                    },
                    error => {
                        log('User upgrades to admin failed')
                        res.status(400).send(error); // 400 for bad request
                    }
                );
            }
        })
        .catch(error => {
            log(error)
            res.status(400).send(); // bad request for changing the student.
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

// Get first 10 playlist
app.get("/public/playlists", (req, res) => {
    Playlist.find({'visible':{$in: '1'}}).sort({lastModifiedTime: -1}).limit(10).then(
        playlists => {
            log('Playlists number: ' + playlists.length)
            res.send({ playlists });
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

// return all playlists detail info created by a user using their userid
// /playlists？userid=xxx
app.get('/playlists', (req, res) => {
    User.findById(req.query.userid.toString())
        .then(user => {
            if (!user) {
                res.status(404).send();
            } else {
                log(user.playlists)
                Playlist.find({'_id':{$in: user.playlists}})
                    .then(playlists => {
                        res.send(playlists)
                    })
            }
        })
        .catch(error => {
            res.status(400).send(); // bad request for changing the student.
        });
})

// create a new playlist by a user
app.post('/playlist', (req, res) => {
	// const errors = validationResult(req)
	// if (!errors.isEmpty()) {
	// 	return res.status(400).json({ errors: errors.array() })
	// }
    let oldUserPlaylists = []
    User.findById(req.body.userid.toString())
        .then(user => {
            if (!user) {
                res.status(404).send();
            } else {
                log('playlists number: ' + user.playlists.length)
                oldUserPlaylists = user.playlists
                if(user.playlists.length >= 20){
                    res.status(400).send('The number of playlists has already reach max limit');
                }
            }
        })
        .catch(error => {
            res.status(400).send(); // bad request for changing the student.
        });

    const newList = new Playlist({
        listname: req.body.listname.toString(),
        username: req.body.username.toString(),
        lastModifiedTime: new Date(),
        totalPlaytime: '00:00',
        userid: req.body.userid.toString()
    });

    if(req.body.description){
        newList.description = req.body.description.toString()
    }
    if(req.body.visible){
        newList.visible = req.body.visible.toString()
    }

    // find each track by track id in the req.body
    Track.find({'track_id':{$in: req.body.tracks}})
        .then(tracks =>{
            // add on playtime
            tracks.forEach(track => {
                newList.totalPlaytime = convertToDuration(convertToSeconds(track.track_duration) + convertToSeconds(newList.totalPlaytime))
            })
            // update tracks
            newList.tracks = tracks
            newList.save().then(
                result => {
                    // update old list
                    oldUserPlaylists.push(result._id)
                    // update new playlist id to the user's record
                    User.findByIdAndUpdate(req.body.userid.toString(), { playlists: oldUserPlaylists }, { new: true })
                        .then(user => {
                            if (!user) {
                                res.status(404).send('User does not exist')
                            } else {
                                res.send(result);
                            }
                        })
                        .catch(error => {
                            res.status(400).send(); // bad request for changing the student.
                        });
                },
                error => {
                    res.status(400).send(error); // 400 for bad request
                }
            );

        })
        .catch(error => {
            log(error)
            res.status(500).send(); // server error
        });
})

/// delete a playlist by listID and update info by userid
app.delete("/playlist", (req, res) => {
    const id = req.body.listid.toString()
    const userid = req.body.userid.toString()
    User.findById(userid)
        .then(user => {
            let flag = false
            user.playlists.forEach(listid => {
                if (listid.toString() === id) {
                    flag = true
                }
            })
            if (!flag) {
                 // user doesn't own the playlist
                res.status(403).send('User does not own the playlist')
                return
            }
        })
        .catch(error => {
            res.status(400).send(); // bad request for changing the student.
        });

    Playlist.findByIdAndRemove(id)
        .then(playlist => {
            if (!playlist) {
                res.status(404).send('Playlist does not exist'); // not find the playlist
            } else {
                User.findById(userid)
                .then(user => {
                    if (!user) {
                        res.status(404).send('Cannot find user');
                    } else {
                        // also delete the playlist id inside user record
                        user.playlists = user.playlists.filter(listid => {
                            log(listid.toString(), id)
                            return listid.toString() !== id
                        })
                        user.save().then(
                            result => {
                                res.send(playlist);
                            },
                            error => {
                                res.status(400).send(error); // 400 for bad request
                            }
                        );
                    }
                })
                .catch(error => {
                    res.status(400).send(); // bad request for changing the student.
                });
            }
        })
        .catch(error => {
            res.status(500).send(); // server error, could not delete.
        });
});

// delete/add a track to a playlist
// updateOrDelete 1 update 0 delete
app.post('/playlist/tracks/update', (req, res) => {
    const newTrackId = req.body.trackid.toString()
    const playlistId = req.body.playlistid.toString()
    const updateOrDelete = req.body.updateOrDelete.toString()

    Track.findOne({ track_id: newTrackId })
        .then(track => {
            if (!track) {
                res.status(404).send('Track does not exist');
            } else {
                Playlist.findById(playlistId)
                    .then(playlist => {
                        if (!Playlist) {
                            res.status(404).send('Playlist does not exist');
                        } else {
                            if (updateOrDelete === '1') {
                                playlist.tracks.push(track)
                                playlist.totalPlaytime = convertToDuration(convertToSeconds(track.track_duration) + convertToSeconds(playlist.totalPlaytime))
                            } else if (updateOrDelete === '0') {
                                playlist.tracks = playlist.tracks.filter(list => {
                                    return list.track_id !== newTrackId
                                })
                                playlist.totalPlaytime = convertToDuration(convertToSeconds(playlist.totalPlaytime) - convertToSeconds(track.track_duration))
                            }
                            playlist.save().then(
                                result => {
                                    res.send(playlist);
                                }),
                                error => {
                                    res.status(400).send(error); // 400 for bad request
                                }
                        }
                    })
            }
        })
        .catch(error => {
            res.status(400).send(); // bad request for changing the student.
        });

})

// update visible, description of a playlist
app.post('/playlist/update', (req, res) => {
    const playlistId = req.body.playlistid.toString()
    const userid = req.body.playlistid.toString()
    // check if the user own the playlist
    User.findById(userid)
        .then(user => {
            let flag = false
            user.playlists.forEach(listid => {
                if (listid.toString() === id) {
                    flag = true
                }
            })
            if (!flag) {
                 // user doesn't own the playlist
                res.status(403).send('User does not own the playlist')
                return
            }
        })
        .catch(error => {
            res.status(400).send(); // bad request for changing the student.
        });


    const { visible, description } = req.body;
    const changes = { visible, description, lastModifiedTime: new Date() };
    
    Playlist.findByIdAndUpdate(playlistId, { $set: changes }, { new: true })
        .then(playlist => {
            if (!playlist) {
                res.status(404).send('Playlist does not exist');
            } else {
                res.send(playlist);
            }
        })
        .catch(error => {
            res.status(400).send(); // bad request for changing the student.
        });

})

// add a rating to the playlist
app.post('/playlist/rating', (req, res) => {
    const rating = req.body.rating.toString()
    const playlistid = req.body.playlistid.toString()
    const userid = req.body.playlistid.toString()
    // check if the user own the playlist
    User.findById(userid)
        .then(user => {
            let flag = false
            user.playlists.forEach(listid => {
                if (listid.toString() === id) {
                    flag = true
                }
            })
            if (!flag) {
                 // user doesn't own the playlist
                res.status(403).send('User does not own the playlist')
                return
            }
        })
        .catch(error => {
            res.status(400).send(); // bad request for changing the student.
        });
    
    Playlist.findOne({ _id: playlistid })
        .then(playlist => {
            if (!playlist) {
                res.status(404).send('Playlist does not exist');
            } else {
                if (playlist?.rating) {
                    log('update rating')
                    playlist.numberOfRatings = (parseInt(playlist.numberOfRatings) + 1).toString()
                    const avg = (parseInt(playlist.rating) + parseInt(rating)) / parseInt(playlist.numberOfRatings)
                    playlist.rating = avg.toFixed(1)
                } else {
                    log('no rating')
                    playlist.numberOfRatings = '1'
                    playlist.rating = parseInt(rating)
                }
                playlist.save().then(
                    result => {
                        log('Update rating success')
                        res.send(playlist);
                    }),
                    error => {
                        res.status(400).send(error); // 400 for bad request
                    }
            }
        })
        .catch(error => {
            log(error)
            res.status(400).send(); // bad request for changing the student.
        });

})

// add a review to the playlist
app.post('/playlist/review', (req, res) => {
    const playlistid = req.body.playlistid.toString()

    const review = {
        content: req.body.review.toString(),
        creationTime: new Date(),
        creatorUsername: req.body.username.toString(),
        creatorId: req.body.userid.toString(),
        hidden: '0' // 1 hidden, 2 public
    }
    
    Playlist.findOne({ _id: playlistid })
        .then(playlist => {
            if (!playlist) {
                res.status(404).send('Playlist does not exist');
            } else {
                review.id = parseInt(playlist.reviews.length) + 1
                playlist.reviews.push(review)
                playlist.save().then(
                    result => {
                        log('Update review success')
                        res.send(playlist);
                    }),
                    error => {
                        res.status(400).send(error); // 400 for bad request
                    }
            }
        })
        .catch(error => {
            log(error)
            res.status(400).send(); // bad request for changing the student.
        });

})

// update a review's hidden status
// 1 hide, 0 public
app.post('/playlist/review/update', (req, res) => {
    const hidden = req.body.hidden.toString()
    const reviewid = req.body.reviewid.toString()
    const playlistid = req.body.playlistid.toString()

    Playlist.findOne({ _id: playlistid })
        .then(playlist => {
            if (!playlist) {
                res.status(404).send('Playlist does not exist');
            } else {
                playlist.lastModifiedTime = new Date()
                playlist.reviews[parseInt(reviewid)-1].hidden = hidden
                playlist.markModified('reviews');
                playlist.save().then(
                    result => {
                        log('Update review hidden status success')
                        res.send(result);
                    }),
                    error => {
                        log(error)
                        res.status(400).send(error); // 400 for bad request
                    }
            }
        })
        .catch(error => {
            log(error)
            res.status(400).send(); // bad request for changing the student.
        });
})

// create a notice/request/dispute to site admin
app.post("/admin/message", (req, res) => {
    const content = req.body.content.toString()
    const contact = req.body.contact.toString()
    const type = req.body.type.toString()
    log(req.body)

    // Create a new user
    const message = new Message({
        content: content,
        contact: contact,
        type: type,
		creationDate: new Date(),
    });

    // Save the user
    message.save().then(
        message => {
            log('Create ' + type + 'success')
            res.send(message)
        },
        error => {
            log(error)
            res.status(400).send(error)
        }
    );
});

// get a list of request/notice/dispute
app.get("/admin/message", (req, res) => {
    log('type: ' + req.query.type.toString())
    const type = req.query.type.toString()
    Message.find({ 'type': { $in: type } }).sort({ creationDate: -1 })
        .then(message => {
            if (!message) {
                res.status(404).send('User does not exist')
            } else {
                res.status(200).send({ message })
            }
        })
        .catch(error => {
            log(error)
            res.status(401).send()
        });
});

// create/modify a security/DMCA/AUP policy
app.post("/admin/policy", (req, res) => {
    const content = req.body.content.toString()
    const type = req.body.type.toString()
    const updateOrCreate = req.body.updateOrCreate.toString()
    log(req.body)
    if (updateOrCreate === 'create') {
        // Create a new user
        const policy = new Policy({
            content: content,
            type: type,
            creationDate: new Date(),
        });

        // Save the user
        policy.save().then(
            message => {
                log('Create ' + type + ' success')
                res.send(message)
            },
            error => {
                log(error)
                res.status(400).send(error)
            }
        );
    } else if (updateOrCreate === 'update'){
        Policy.findOneAndUpdate({ type: type }, { content: content, creationDate: new Date() }, { new: true})
            .then(policy => {
                if (!policy) {
                    res.status(404).send('Policy does not exist');
                } else {
                    log('Policy update success')
                    res.send(policy)
                }
            })
            .catch(error => {
                log(error)
                res.status(400).send(); // bad request for changing the student.
            });
    }
});


// get a security/DMCA/AUP policy
app.get("/admin/policy", (req, res) => {
    log('type: ' + req.query.type.toString())
    const type = req.query.type.toString()
    Policy.find({ 'type': { $in: type } })
        .then(policy => {
            if (!policy) {
                res.status(404).send('Policy does not exist')
            } else {
                res.status(200).send({ policy })
            }
        })
        .catch(error => {
            log(error)
            res.status(401).send()
        });
});

/*** Helper Functions ************************************/

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
