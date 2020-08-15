// To test query from and to server
var async = require("async");
// var util = require("util");
// set up connection to MySQL server
var connection = require("./config/database");
connection.connect(function(err){
    if(err) throw err;
    console.log("Connection to MySQL opens..");
});
// set up connection with Mongo Server
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/my_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on("connected", function(){
    console.log("Connection to Mongo opens ..");
})
mongoose.connection.on("error", function(err){
    console.log("Connection to Mongo error: ", err);
})
mongoose.connection.on("disconnected", function(){
    console.log("Disconnected from Mongo ..");
});

var items = require("./model/items");
// console.log("Hi!")
// var messages = []
// var items = []
// class Item {
//     constructor(username, itemId, photos) {
//         this.username = username
//         this.itemId = itemId
//         this.photos = photos
//     }}
// var itemProcessed = 0
// var query = `select users.username, items.id as itemId from users
// join items
// on users.id = items.user_id
// where user_id = 1;`
// connection.query(query, function(err, results){
//     console.log(results);
//     // use a simple counter, async.forEachOf() does not seem to work
//     results.forEach((result, i) => {
//         itemPhotos.findOne({itemId: result.itemId}, function(err, doc) {
//             if(err) {cb(err)}
//             else {
//                 console.log(doc)
//                 var item = new Item(result.username, result.itemId, doc.photos)
//                 items.push(item)
//                 console.log(items[i])
//                 itemProcessed ++
//                 if(items.length === itemProcessed) {console.log(items)}
//             }
//         })
//     })
    
// var queryItem = function(req, res, next) {
//     items.find(
//         {username: req.user.username},
//         function(err, docs) {console.log(docs)}
//     )
// }
items.find({})

.then(function(docs) {console.log(docs)}).catch(err => {console.log(err)})

    
// })
// var messages = []
// var query1 = `select users.username, items.id from users
// join items
// on users.id = items.user_id
// where user_id = 1;`
// connection.query(query1, function(err, results_01){
//     console.log(results_01)
//     async.forEachOf(results_01, function(result_01, i, cb) { 
//         // cb to catch error
//         var query2 = `select photos from items
//         join item_photos
//         on items.id = item_photos.item_id
//         where items.id = ?;`
//         connection.query(query2, [result_01.id], function(err, results_02) {
//             if (!err) {
//             console.log("Enter second loop..")
//             var photos_lst = [];
//             var k;
//             for(k = 0; k < results_02.length; k++) {
//                 photos_lst.push(results_02[k].photos);
//             }
//             console.log(i)
//             var message = `${result_01.username} listed ${result_01.id} with items'photos ${photos_lst}`
//             console.log(message)
//             messages.push(message)
//             cb(null);
//             } else {cb(err)}
//         })
//     }, function() {console.log(messages)}
//     )})


// console.log("Hi!")
// console.log(`The messages are ${messages}`)

// var messages = [];
// var query1 = `SELECT id, username FROM users`;
// connection.query(query1, function(err, results_01) {
//     if(err) {console.log(err)}
//     console.log(results_01);
//     // Iterate through each user's username and id
//     async.forEachOf(results_01, function(result_01, i, cb) {
//         // console.log(result_01)
//         var query2 = `select users.username, items.id from users
//         join items
//         on users.id = items.user_id
//         where users.id = ?`
//         connection.query(query2, [result_01.id], function(err, results_02) {
//             console.log(results_02);
//             if (!err) {
//                 // iterate through each item of a particular user
//                 async.forEachOf(results_02, function(result_02, j) {
//                     var query3 = `select photos from items
//                     join item_photos
//                     on items.id = item_photos.item_id
//                     where items.id = ?;`
//                     connection.query(query3, [result_02.id], function(err, results_03) {
//                         if (!err) {
//                             console.log(results_03);
//                             var photos_lst = [];
//                             var k;
//                             for(k = 0; k < results_03.length; k ++) {
//                                 photos_lst.push(results_03[k].photos)
//                             }
//                             var message = `${result_02.username} listed ${result_02.id} with items' photos ${photos_lst}`
//                             messages.push(message);
//                             console.log(messages[j])
//                         } else {cb(err)}
//                     })
//                 }, 
//                 // function() {
//                 //     if(!err) {console.log(messages)}
//                 // }
//                 )
//             } else {cb(err);}
//         })
//         // console.log(messages[i])
//     }
//     )
    
// })

// next step write this in a middleware and display the listing

// var query = `select photos from items
// join item_photos
// on items.id = item_photos.item_id
// where items.id = "test123-item1";`
// connection.query(query, function(err, results) {
//     console.log(results);
// })
// var CryptoJS = require("crypto-js");

// Encrypt
// var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123').toString();
// console.log(ciphertext);
// console.log(Date.now());

// var token_id_1 = CryptoJS.AES.encrypt("test123", "password").toString();
// var token_id_2 = CryptoJS.AES.encrypt("test123", "password").toString();
// console.log(token_id_1 == token_id_2);
// var name = "Adam";
// var Upload = class {
//     msg;
    
//     constructor(msg) {
//         this.msg = msg;
//     }
//     notify(msg) {
//         // console.log(this);
//         // console.log(msg);
//         console.log(msg);
//         console.log(name);
//     }
//     print(msg) {
//         console.log(this);
//         this.notify(msg);
//     }
// }
// new Upload().notify()

// var a = function (){
//     var b = function(){
//         console.log(Date.now())
//     }
//     b();
// }
// a();

// var express = require('express');
// var app = express();

// var myLogger = function (req, res, next) {
//     console.log('LOGGED')
//     next()
// }

// app.use(myLogger) // all route handler can use this middleware. this middleware isa invoked first before any other middleware defined (passed in as callback) later
// // do not write myLogger() because we are not invoking the function but simply pass it in as a callback
// app.get('/',function (req, res) {
//     res.send('Hello World!')
// })
// app.get("/content", function(req, res) {
//     res.send(`Some content from "Hello World"!` )
// })

// app.listen(3000);

// Predict: "LOGGED" printed 3 times




// File path to mysql server (& mysql command line client) C:\Program Files\MySQL\MySQL Server 8.0\bin