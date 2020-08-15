var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "my_database",
    password: "2000pvlan"
});


module.exports= connection;


