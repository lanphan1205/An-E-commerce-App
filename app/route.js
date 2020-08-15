// var fs = require("fs").promises; // to be used in async function
var CryptoJS = require("crypto-js");
var async = require("async");
var connection = require("../config/database");
var items = require("../model/items");


// set up route for our app, in conjuction with passport
module.exports= 
{routeAuthenticate: 
    function(app, passport){
    // Routing goes here

    // Log in
    app.get("/login", function(req, res){
        res.render("../public/views/login", {message: req.flash("error")}); // message is null in the beginning when user has not submit sign up
    });

    app.post("/login", 
    passport.authenticate("local-login",{
        successRedirect: "/profile",
        failureRedirect: "/login", // Combine with GET method to display flash message is a good idea here
        session: true,
        failureFlash: true
    }),
    );

    // redirect to home page after log out session
    app.get("/logout", 
    function(req, res){
        req.logout();
        if(!req.isAuthenticated()){
            res.render("../public/views/home");
        }
    });

    // sign up
    app.get("/signup", 
    function(req, res) {
        res.render("../public/views/signup", {message: req.flash("error")});
    }); // GET method looks for the first argument where href value in anchor tags matches

    app.post("/signup", 
    passport.authenticate("local-signup",{
        successRedirect: "/profile",
        failureRedirect: "/signup",
        session: true,
        failureFlash: true
    }), // POST method looks for the first param where the value of the action attribute in form field matches
    );

    // Sell
    app.get("/sell", function(req, res) {
        if(req.isAuthenticated()) {
            res.render("../public/views/upload");
        } else {res.render("../public/views/home");}
    });

    // View Listing
    var queryListing = function(req, res, next) {
        if(req.isAuthenticated()) {
            items
            .find({username: req.user.username})
            .then(
                function(docs) {
                    console.log(docs)
                    req.items = docs
                    res.render("../public/views/items_listing", {items: req.items})
                }
            )
            .catch(err => {console.log(err)})
        } else {res.render("../public/views/home");}
    }

    app.get("/view-listing", queryListing);

    // Store
    var queryStore = function(req, res, next) {
        if(req.isAuthenticated()) {
            items
            .find({})
            .exec()
            .then(
                function(docs) {
                    console.log(docs)
                    req.store = docs
                    res.render("../public/views/store", {store: req.store})
                }
            )
            .catch(err => {console.log(err)})
        } else {res.render("../public/views/home");}
    }
    app.get("/store", queryStore);
},

routeUploadFiles: 
    function(app, multer, fs){

    var createUserDir = async function(req) {
        fs.promises.mkdir(`C:/Users/Admin/Desktop/An E-Commerce App/public/uploads/${req.user.username}`,
        { recursive: true }, // without this the function will throw err on the second upload
        function(err) {console.log(err);}
        );
    };

    var generateItemId = function(id) {
        var itemId =  `item${id}`;
        return itemId;
    }

    var createItemDir = async function(req, itemId) {
        fs.promises.mkdir(`C:/Users/Admin/Desktop/An E-Commerce App/public/uploads/${req.user.username}/${itemId}`,
        { recursive: true }, // without this the function will throw err on the second upload
        function(err) {console.log(err);}
        );
        console.log(`C:/Users/Admin/Desktop/An E-Commerce App/public/uploads/${req.user.username}/${itemId}`);
    };

    var storage = 
    multer.diskStorage({
    destination: function(req, file, cb) {
        // Fix
        //Write query here: count how many items user has listed
        var query = `SELECT count(*) as count from items where user_id = ?`;
        connection.query(query,
            [req.user.id],
            function(err, results){
                // in the callback of the query, write the chained promises
                if(err) {console.log(err)}
                var id = results[0].count + 1;
                console.log(id);
                var itemId = generateItemId(id);
                console.log(itemId);
                createUserDir(req)
                .then(createItemDir(req, itemId))
                .then(cb(null, `public/uploads/${req.user.username}/${itemId}`))
                console.log(`public/uploads/${req.user.username}/${itemId}`);
            })
        
    },
    filename: function(req, file, cb) {
        cb(null, `${file.originalname}`);
    }
})


    app.post("/upload",
    multer({storage: storage})
    .array("itemphotos", 2),
    function(req, res) {
        // res.send("Photos submitted successfully!");
        res.render("../public/views/upload_success");
        // insert items and its photos' references here
        // so next query to db will give the correct item_id (in increasing order)
        // to test this, we need to make sure the table and the folder on the server matches, preferably by clearing both
        // this works if data being inserted after being saved on the server
        // in the future we also need to handle the text field
        // repeat the same way to generate item_id when saving items' photos

        // Saving item's photos to database

        var query = `SELECT count(*) as count from items where user_id = ?`;
        connection.query(query, [req.user.id], function(err, results){
            var id = results[0].count + 1;
            console.log(id);
            var itemId_Db = `${req.user.username}-${generateItemId(id)}`; 
            console.log(itemId_Db);
            var query = `INSERT INTO items(id, user_id) VALUES (?, ?)`;
            connection.query(query, [itemId_Db, req.user.id], function(err, results){
                if(err) {console.log(err)}
            });
            var directoryPath = `C:/Users/Admin/Desktop/An E-Commerce App/public/uploads/${req.user.username}/${generateItemId(id)}`;
            fs.readdir(directoryPath, function(err, files){
                console.log("Reading files..");
                if(err) {console.log(err);}
                // var itemPhoto = new itemPhotos();
                console.log(itemId_Db)
                items.create({username: req.user.username, itemId: itemId_Db, photos: files}) 
                // run each insert query for each file
                files.forEach(file => {
                    console.log(file);
                    // insert to mySQL
                    var query = `INSERT INTO item_photos(item_id, photos) VALUES (?, ?)`;
                    connection.query(query, [itemId_Db, file], function(err, results){
                        if(err) {console.log(err);}
                    })
                });
            })
        })
        // if this works, also need to insert photos name to the item_photos table. the photos name to be the one on the server
        // okay this works
        // clear items table and user's folder(or item's folder) on server before proceeding

    });
    },
routeMessages: 
    function(app, io) {
    // Messages
    var saveMessage = function(req, res) {
        var userId = req.user.id
        var itemId = req.body.itemId
        var message = req.body.itemMessage
        // console.log(itemId)
        // console.log(message)
        var query = `insert into messages(user_id, item_id, content) values (?, ?, ?)`
        connection.query(query, [userId, itemId, message], function(err, results) {
            if(err) {console.log(err)}
        }) // the timestamp is auto created in the db when insert query is successful
    }

    var queryMessagePreview = function(req, res) {
        // console.log(`Is user authenticated? ${req.isAuthenticated()}`)
        if(req.isAuthenticated()) {
            // query Message preview here, to be injected into message template
            // for now, just the itemId will do (items which user 'test' has sent messages about)
            var query = `select messages.user_id as "sender_id", messages.content as "content", items.user_id as "receiver_id", items.id as "item_id"
                        from items
                        join messages
                        on items.id = messages.item_id
                        where items.user_id = ? or messages.user_id = ?
                        group by items.id;` //the query should show all the messages that the user is involved 
            connection.query(query, [req.user.id, req.user.id], function(err, results) {
                if(err) {console.log(err)}
                // console.log(results)
                // Here can reformat message preview before sending to client
                res.render("../public/views/message", {messagesPreview: results, messages: null})
            })
        } else {res.render("../public/views/home")}
    }

    var queryMessageMiddleware = function(req, res) {
        if(req.isAuthenticated()) {
            // Still need to query message preview
            var query = `select messages.user_id as "sender_id", messages.content as "content", items.user_id as "receiver_id", items.id as "item_id"
                        from items
                        join messages
                        on items.id = messages.item_id
                        where items.user_id = ? or messages.user_id = ?
                        group by items.id;` //the query should show all the messages that the user is involved 
            connection.query(query, [req.user.id, req.user.id], function(err, results_0) {
                if(err) {console.log(err)}
                // console.log(results_0)
                // Now query message
                var query = `select messages.user_id as "sender_id", messages.content as "content", items.user_id as "receiver_id", messages.item_id as "itemId", messages.created_at as "timestamp" from messages 
                            join items
                            on messages.item_id = items.id
                            join users
                            on messages.user_id = users.id -- receiver
                            where item_id = ?
                            order by messages.created_at ;`
                // query message (for a particular item here) here
                connection.query(query, [req.params.item_id], function(err, results_1) {
                    if(err) {console.log(err)}
                    // console.log(results_1)
                    // use for loop here to query username(sender) for each message
                    var messages = []
                    var itemProcessed = 0
                    results_1.forEach((result_1, i) => {
                        var query = `select username as sender from users 
                                    where users.id = ?;`
                        connection.query(query, [result_1.sender_id], function(err, results_2) {
                            if(err) {console.log(err)}
                            else {
                                    var sender = results_2[0].sender
                                    var itemId = result_1.itemId
                                    var content = result_1.content
                                    var timestamp = result_1.timestamp
                                    var username = req.user.username
                                    var message = {
                                        sender: sender,
                                        itemId: itemId,
                                        content: content,
                                        timestamp: timestamp,
                                        username: username
                                    }
                                    itemProcessed ++
                                    messages.push(message)
                                    if(itemProcessed == results_1.length) {
                                        // console.log(messages)
                                        res.render("../public/views/message", 
                                        {messagesPreview: results_0, 
                                        messages: messages})
                                    }
                            }
                        })
                    })
                })
            })
        }
    }
    // Might consider change the name of one of the 2 routes below
    app.post("/messages", saveMessage) // This is to save messages from store page
    app.get("/messages", queryMessagePreview) 
    app.get("/messages/:item_id", queryMessageMiddleware)

    // Real-time chats
    var queryMessage = function(socket, itemId) {
        var query = `select messages.user_id as "sender_id", messages.content as "content", items.user_id as "receiver_id", messages.item_id as "itemId", messages.created_at as "timestamp" from messages 
        join items
        on messages.item_id = items.id
        join users
        on messages.user_id = users.id -- receiver
        where item_id = ?
        order by messages.created_at ;`
        // query message (for a particular item) here
        connection.query(query, [itemId], function(err, results_1) {
            if(err) {console.log(err)}
            // console.log(results_1)
            // use for loop here to query username(sender) for each message
            var messages = []
            var itemProcessed = 0
            results_1.forEach((result_1, i) => {
                var query = `select username as sender from users 
                            where users.id = ?;`
                connection.query(query, [result_1.sender_id], function(err, results_2) {
                    if(err) {console.log(err)}
                    else {
                            var sender = results_2[0].sender
                            var itemId = result_1.itemId
                            var content = result_1.content
                            var timestamp = result_1.timestamp
                            var message = {
                                sender: sender,
                                itemId: itemId,
                                content: content,
                                timestamp: timestamp
                            }
                            itemProcessed ++
                            messages.push(message)
                            if(itemProcessed == results_1.length) {
                                // console.log(messages)
                                // res.render("../public/views/message", 
                                // {messagesPreview: results_0, 
                                // messages: messages})
                                if(socket !== null) {
                                    socket.emit("refresh message", messages)
                                }
                            }
                    }
                })
            })
        })
    }
    var queryUpdatedMessage = function(socket, message) {
        console.log(message.username)
        // Save message
        var query = `SELECT id from users where username = ?`
        connection.query(query, [message.username], function(err, results) {
            var userId = results[0].id
            var itemId = message.itemId
            var content = message.itemMessage
            var query = `insert into messages(user_id, item_id, content) values (?, ?, ?)`
            connection.query(query, [userId, itemId, content], function(err, results) {
                if(err) {console.log(err)}
                // must send back data from database
                queryMessage(socket, itemId) // # of messages after 
            })
        })
    
    }
    io.on("connection", (socket) => {
        console.log("user connected to socket..")
        socket.on("message added", function(message) {
            // message is already a js object but to see it we need to convert it to JSON
            // Access it in the js object form
            // message.username here is the so called "sender"
            queryUpdatedMessage(socket, message)
        })
        socket.on("check message", function(itemId) {
            queryMessage(socket, itemId) // This will in turn fire "refresh message"
        })
    })
        

    // Chat
    app.get("/message-chat", queryMessage)
    },
routeUnmatched:
    function(app) {
    app.get("*", function(req, res){
        if(req.isAuthenticated()) {
            res.render("../public/views/profile", {user: req.user});}
        else {res.render("../public/views/home");}
    });
}
};