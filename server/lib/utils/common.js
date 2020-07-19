

class Common {
    handleResponse = (err, data, res) => {
        var response_data = {};
        if(err) {
            response_data = {
                "status" : "failure",
                "data" : err || "Unexpected error found"
            };
        } else {
            response_data = {
                "status" : "success",
                "data" : data || []
            };
        }
        res.status(200).set('Content-Type', 'application/json').json(response_data);
    }
}

module.exports = new Common;