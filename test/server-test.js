var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/my_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.once("open", function(){
    console.log("Connection opens ..");
})
mongoose.connection.on("error", function(err){
    console.log("Connection error: ", err);
})
mongoose.connection.on("disconnected", function(){
    console.log("Disconnected ..");
});

var userSchema = new mongoose.Schema({
    local: {
        username: "string",
        password: "string"
    }
});

var User = mongoose.model("User", userSchema);

var test_user = new User({
    local: {
        username: "test123",
        password: "password"
    }
});

test_user.save(function(err){
    if (err) return handleError(err);
});

