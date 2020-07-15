// Set up user model here
var mongoose = require("../node_modules/mongoose");
var userSchema = new mongoose.Schema({
    local : {
        username: "string",
        password: "string"
    }
});
userSchema.methods.isValidPassword = function(password){
    if (password === this.local.password) {return true;}
    else {return false;}
};

var User = mongoose.model("User", userSchema);

module.exports = User;



// Database -> Collection -> Documents