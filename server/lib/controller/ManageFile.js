
const path = require('path');

const multer = require("multer");
    
class ManageFile {
    constructor() {
        this.file_name = null;
    }
         

    fileUpload = (req, res, callback) => {
    
        const storage = multer.diskStorage({
            destination: (request, file, cb) => {
                cb(null, '../client/public/images')
            },
            filename: (request, file, cb) => {
                this.file_name = Date.now() + '_' +file.originalname;
                cb(null, this.file_name)
            }
        });
        
        const fileFilter = (request, file, cb) => { 
            let filetypes = /jpeg|jpg|png/; 
            let mimetype = filetypes.test(file.mimetype); 

            let extname  = filetypes.test(path.extname(file.originalname).toLowerCase()); 
        
            if (mimetype && extname)
                return cb(null, true); 

            cb("File upload only supports the following filetypes - " + filetypes); 
        }  
        
        const upload = multer({ storage: storage , fileFilter : fileFilter}).single('file');
    
        upload(req, res, (err, data) => { 
            console.log('this.file_name :>> ', this.file_name);
            if(err) 
                return callback(err) 
            
            callback(null, this.file_name);    
        });

    }
    
}

module.exports = new ManageFile;