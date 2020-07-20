// To test query from and to server


// set up connection to MySQL server
// var connection = require("./config/database");
// connection.connect(function(err){
//     if(err) throw err;
//     console.log("Connection opens..");
// });

//Query

// Create table
// var query = `CREATE TABLE users(
//     id int auto_increment primary KEY,
//     username varchar(255) unique NOT NULL,
//     email varchar(255) NOT NULL,
//     pword varchar(255) NOT NULL,
//     fname varchar(255) NOT NULL,
//     lname varchar(255) NOT NULL,
//     location varchar(255) NOT NULL
//     )`;

// Insert 
// var query = `insert into users(username, email, pword, fname, lname, location, token_id)
// values ("test123", "test123@gmail.com", "password", "user", "test", "test location", "test")`;


// find users
// var query = `select username from users where username = ?`;

// update users
// var query = `update users set pword = ? where username = ?`;
// connection.query(query, ["pass", "test123"], function(err, results, fields){
//     if(err) throw err;
//     console.log(results);
//     console.log(fields);
// });

// var findQuery = `select count(*) as count, pword from users where username = "test"`;
// connection.query(findQuery, function(err, results){
//     if(err) {return done(err);}
//     console.log(results[0].pword == null);
// });

var CryptoJS = require("crypto-js");

// Encrypt
var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123').toString();
console.log(ciphertext);






// File path to mysql server (& mysql command line client) C:\Program Files\MySQL\MySQL Server 8.0\bin