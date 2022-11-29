/* User model */
'use strict';

const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')


// Mongoose Schema
// Allows us to add additional functionality.
const UserSchema = new mongoose.Schema({
    userName: {
		type: String,
		required: true,
		trim: true,
		unique: false,
		minlength: 1
    },
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: 'Not valid email'
		}
	}, 
	password: {
		type: String,
		required: true,
		minlength: 3
	},
    role: {
        type: String,  // admin 1, user 2
        required: true,
        dafault: '2'
    },
	activate: {
        type: String,  // activate 1, deactivated 0
        required: true,
        dafault: '1'

	},
    playlists: {
        type: Array,
        required: false,
        default: []
    },
    reviews: {
        type: Array,
        required: false,
        default: []
    }
})

// mongoose middleware.
// hash and salt password before savint to the DB.
UserSchema.pre('save', function(next) {
	const user = this;
	// check if the password has been hashed or salted before
	if (user.isModified('password')) {
		// generate salt and hash the password
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash
				next()
			})
		})
	} else {
		next()
	}
})

// find a User by comparing the hashed password
UserSchema.statics.findByEmailPassword = function(email, password) {
	const User = this
	// find the user by their email
	return User.findOne({ email: email }).then((user) => {
		if (!user) {
			return Promise.reject()
		}
		// if the user exists, check password
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, result) => {
				if (result) {
					resolve(user)
				} else {
					reject()
				}
			})
		})
	})
}

const User = mongoose.model('User', UserSchema)
module.exports = { User }