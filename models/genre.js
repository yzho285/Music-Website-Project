/* Genre mongoose model */
const mongoose = require('mongoose')

const GenreSchema = new mongoose.Schema({
	genre_id: {
		type: String,
		required: true,
		minlegth: 1,
		trim: true
	},
	tracks: {
		type: String,
		required: true,
		default: ''
	},
	parent: {
		type: String,
		required: true,
		default: ''
	},
	title: {
		type: String,
		required: true,
		default: ''
	},
	top_level: {
		type: String,
		required: true,
		default: ''
	}
})
const Genre = mongoose.model('Genre', GenreSchema);
module.exports = { Genre }