/* Genre mongoose model */
const mongoose = require('mongoose')

const PolicySchema = new mongoose.Schema({
    content: {
    	type: String,
    	minlegth: 1,
    	required: true
    },
    type: { // security, DMCA, AUP
		type: String,
    	required: true
    },
    creationDate: {
		type: String,
    	required: true
    }
});
const Policy = mongoose.model('Policy', PolicySchema);
module.exports = { Policy }