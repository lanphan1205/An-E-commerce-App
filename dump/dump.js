


function(app, multer){
    // define async function to create user image directory, to be created before image upload
    var createUserDir = async function(req) {
        fs.mkdir(`C:/Users/Admin/Desktop/An E-Commerce App/public/uploads/${req.user.username}`,
        { recursive: true }, // without this the function will throw err on the second upload
        function(err) {console.log(err);}
        );
    };

    var createItemDir = async function(req) {
        var timestamp = toString(Date.now());
        var item_id = `item${timestamp}`;
        fs.mkdir(`C:/Users/Admin/Desktop/An E-Commerce App/public/uploads/${req.user.username}/${item_id}`,
        { recursive: true }, // without this the function will throw err on the second upload
        function(err) {console.log(err);});
        return item_id;
    }
    
    
    var storage = multer.diskStorage({
        destination: function(req, file, cb) {
            createUserDir(req)
            .then(createItemDir(req))
            .then(
                cb(null, `public/uploads/${req.user.username}/${createItemDir(req)}`) // req.user is an RowDataPacket object that contains user data after successful authentication
            )
        },
        filename: function(req, file, cb) {
            cb(null, `${file.fieldname}${Date.now()}.png`);
            console.log(req.files.length);
        }
    });
    // var queryItem = function(user_id) {
    //     var currentFiles = [];
    //     var query = `SELECT image_ref from items where user_id = ?`;
    //     connection.query(query,
    //         [user_id],
    //         function(err, results){
    //             if(err) {console.log(err);}
    //             var i;
    //             for(i = 0; i < results.length; i++){
    //                 currentFiles.push(results[i].image_ref);
    //             }
    //         });
    //     console.log(currentFiles);
    //     return currentFiles;
    // };
    // var insertItem = function(user_id, image_ref) {
    //     var insertQuery = `INSERT INTO items(user_id, image_ref) VALUES (?, ?)`;
    //     connection.query(insertQuery, 
    //         [user_id, image_ref], 
    //         function(err, results){
    //             if(err) {console.log(err);}
    //     });
    // };
    var upload = multer({storage: storage}); // value of storage property must specify where to store the file and optionally what type of file to save as
    
    app.post("/upload", 
    upload.array("itemphotos", 2),
    function(req, res){
        res.send("Photos submitted successfully!");
        // fs.readdir(`C:/Users/Admin/Desktop/An E-Commerce App/public/uploads/${req.user.username}`, (err, files) => {
        //     // var currentFiles = queryItem(req.user.id); 
        //     // currentFiles is not live
        //     files.forEach(file => {
        //         insertItem(req.user.id, file); // mysql does not remove duplicates
        //     });
        // });
    });
}