/* Student mongoose model */
const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlegth: 1,
		trim: true
	},
	year: {
		type: Number,
		required: true,
		default: 1
	}
})
const Student = mongoose.model('Student', StudentSchema);
module.exports = { Student }