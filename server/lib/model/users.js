const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email_id: {
        type: String,
        required: true
    },
    job_type: {
        type: String,
        required: true
    },
    date_of_birth: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        required: true
    },
    preferred_location: {
        type: String,
        required: true
    },
    phone_number: {
        type: Number,
        required: true
    }
});


module.exports = mongoose.model('users', UserSchema);
