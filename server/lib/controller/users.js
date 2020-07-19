const Users      = require("../model/users");
const ManageFile = require("./ManageFile");

class UserData {
    saveUser = async (req, callback) => {

        const req_body  = req.body || {};

        if(Object.keys(req_body).length === 0)
            return callback("Empty request data");

        const {username, email_id, job_type, date_of_birth, profile, phone_number, preferred_location} = req_body;

        if(!username)
            return callback("Empty username");
    
        if(!email_id)
            return callback("Empty to email id");
        
        if(!job_type)
            return callback("Empty Job type");

        if(!date_of_birth)
            return callback("Empty Date of Birth");

        if(!profile)
            return callback("Empty Profile Picture");

        if(!phone_number)
            return callback("Empty phone number");

        if(!preferred_location)
            return callback("Empty Preferred location");
    
        try {
            const user_data = await Users.find({email_id: email_id});

            if(user_data && user_data[0] && user_data[0].email_id) {
                return callback(null, "Email Id already exist added successfully");
            }

            const new_user = Users({
                username,
                email_id,
                job_type,
                date_of_birth,
                profile,
                preferred_location,
                phone_number
            });

            await new_user.save();
            callback(null, "User added successfully");
        } catch (error) {
            callback(error);
        }
    }

    saveProfilePic = (req, res, callback) => {
        ManageFile.fileUpload(req, res, async (err, uploaded_file_name) => { 
            if(err) return callback(err) 

            callback(null, uploaded_file_name);    
        });
    }

    getUsers = async (req, callback) => {
        try {
            const user_data = await Users.find({});
            callback(null, user_data);
        } catch (error) {
            callback(error);
        }
    }
    
    deleteUsers = async (req, callback) => {
        var req_body = req.body || null;

        if(!req_body) 
            return callback("Empty request data");

        if(!req_body._id)
            return callback("Empty id to delete user");

        try {
            await Users.remove({_id: req_body._id})
            callback(null, { message : "User deleted successfully"});
        } catch (error) {
            callback(error);
        }
    }

}
module.exports = new UserData;