/* Genre mongoose model */
const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    content: {
    	type: String,
    	minlegth: 1,
    	required: true
    },
    type: {
		type: String,
    	required: true
    },
    creationDate: {
		type: String,
    	required: true
    },
	contact: {
		type: String,
		required: true
	}
});
const Message = mongoose.model('Message', MessageSchema);
module.exports = { Message }
