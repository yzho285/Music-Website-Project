/* Genre mongoose model */
const mongoose = require('mongoose')

const PlaylistSchema = new mongoose.Schema({
	listname: {
		type: String,
		required: true,
        trim: true,
		maxlegth: 50,
        unique: true
	},
	username: {
		type: String,
		required: true,
        trim: true,
		maxlegth: 50,
        unique: true
	},
	visible: {
        type: String, // 1 can be seen, 0 cannot
        required: true,
        default: 0
    },
    tracks: {
        type: Array,
        required: true,
        default: []
    },
    lastModifiedTime: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
        maxlegth: 200
    },
    reviews: {
        type: Array,
        required: false,
        default: []
    },
    rating: {
        type: String,
        required: false
    },
    totalPlaytime: {
        type: String,
        required: false
    }
})
const Playlist = mongoose.model('Playlist', PlaylistSchema);
module.exports = { Playlist }