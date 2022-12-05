/* Genre mongoose model */
const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    content: {
    	type: String,
    	minlegth: 1,
    	required: true
    },
    id: Number,
    creatorUsername: {
		type: String,
    	required: true
    },
    creatorId: {
		type: String,
    	required: true
	},
    creationTime: {
        type: String,
        required: true,
    },
    hidden: { // 1 hide, 0 public
        type: String,
        required: false,
        default: '0'
    }
});
const Review = mongoose.model('Review', ReviewSchema);
module.exports = { Review }