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


// set up connection for mongodb

var mongoose = require("./node_modules/mongoose");
mongoose.connect('mongodb://localhost/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on("connected", function(){
  console.log("Connection opens ..");
})
mongoose.connection.on("error", function(err){
  console.log("Connection error: ", err);
})
mongoose.connection.on("disconnected", function(){
  console.log("Disconnected ..");
});


// address to start mongo server and mongoshell C:\Program Files\MongoDB\Server\4.2\bin




require("./config/passport")();

require("./app/route")(app, passport);

app.listen(3000);

