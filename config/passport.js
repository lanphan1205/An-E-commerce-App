// Set up passport config here
var passport = require("../node_modules/passport");
var localStrategy = require("../node_modules/passport-local").Strategy;
var User = require("./database");

module.exports = function() {
    passport.use("local-login", new localStrategy(
        {passReqToCallback: true},
        function(req, username, password, done) {
            User.findOne({"local.username": username}, 
            function(err, user){
                if(err) {return done(err);}
                if(!user) {
                    return done(null, false, req.flash("error", "Incorrect username"));}
                if (!user.isValidPassword(password)){
                    return done(null, false, req.flash("error", "Incorrect password"));
                }
                return done(null, user);
            });
            
        }
    ));

    // passport.use("local-logout", new localStrategy(
    //     {passReqToCallback: true},
    //     function(req, username, password, done){
    //         req.logout();
    //     }
    // ));

    passport.use("local-signup", new localStrategy(
        {passReqToCallback: true},
        function(req, username, password, done){
            User.findOne({"local.username": username},
            function(err, user) {
                // Error Connection to Database
                if(err) {return done(err);}

                // A user with the same username already exists after performing search
                if(user) {return done(null, false, req.flash("error", "Username already exists"));}
            
                // No user with the same username exists
                if(!user) {
                var user = new User({
                    local: {
                        username: username,
                        password: password
                    }
                });
                user.save();
                return done(null, user);
                }
            }
            )  
        }
    ));
    // When user authenticaticates successfully (either sign up or sign in),
    // the user's id (created in the db) will be stored in the session on server
    // and cookie on client so next time the user will be logged in automatically.
    // this is because server with a working session ID will check against the cookie from 
    // client's request and authenticate.
    // if user log out, the session expires and user is no longer authenticated. The 
    // whole process has to repeat..
    passport.serializeUser(
        function(user, done){
            done(null, user._id); 
        });
    passport.deserializeUser(
        function(id, done){
            User.findById(id, function(err, user) {done(err, user);});
        });
};
