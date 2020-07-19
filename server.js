// this is the starting point of our app

// set up express
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var passport = require("passport");  
var session = require("express-session");
var flash = require("connect-flash");
var path = require("path");


// console.log("/ means ", path.resolve("/"));
// console.log("./ means ", path.resolve("./"));
// console.log("../ means ", path.resolve("../"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(session({ secret: 'anything' })); // Might have error here. can try installing express-session separately and use it
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// set up connection to MySQL server
var connection = require("./config/database");
connection.connect(function(err){
  if(err) throw err;
  console.log("Connection opens..");
});

// file path to mysql server and command line client C:\Program Files\MySQL\MySQL Server 8.0\bin




// require("./config/passport")();

// require("./app/route")(app, passport);

app.listen(3000);

