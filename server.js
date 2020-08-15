// this is the starting point of our app

// set up express
var express = require("express");
var app = express();
var http = require("http")
var bodyParser = require('body-parser');
var passport = require("passport");  
var session = require("express-session");
var flash = require("connect-flash");
var multer = require("multer");
var fs = require("fs");
// var path = require("path");

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

var server = http.createServer(app)
var io = require("socket.io")(server)


// set up connection to MySQL server
var connection = require("./config/database");
connection.connect(function(err){
    if(err) throw err;
    console.log("Connection to MySQL opens..");
});

// set up connection to mongodb server
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


// file path to mysql server and command line client C:\Program Files\MySQL\MySQL Server 8.0\bin
// file path to mongo server and command line client C:\Program Files\MongoDB\Server\4.2\bin


require("./config/passport")();

require("./app/route").routeAuthenticate(app, passport);

require("./app/route").routeMessages(app, io);

require("./app/route").routeUploadFiles(app, multer, fs);

require("./app/route").routeUnmatched(app);

server.listen(3000, () => {console.log("Server listens at port 3000..")});

