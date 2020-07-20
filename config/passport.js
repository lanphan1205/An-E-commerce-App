// Set up passport config here
var passport = require("../node_modules/passport");
var localStrategy = require("../node_modules/passport-local").Strategy;
var connection = require("./database");
var CryptoJS = require("crypto-js");

module.exports = function() {
    passport.use("local-login", new localStrategy(
        {passReqToCallback: true},
        function(req, username, password, done){
            var findQuery = `select count(*) as count, pword from users where username = ?`;
            connection.query(findQuery, [username], function(err, results){
                if(err) {return done(err);}
                // username does not exist
                if(results[0].count == 0) {
                    return done(null, false, req.flash("error", "username does not exist"));
                }
                // username exists
                if(results[0].count == 1){
                    if(results[0].pword !== password) {
                        return done(null, false, req.flash("error", "Incorrect password"));
                    } else {
                        var findQuery = `select * from users where username = ?`;
                        connection.query(findQuery, [username], function(err, results){
                            if(err) {return done(err)}
                            console.log("user signed in");
                            var user = results[0];
                            return done(null, user);
                        });
                    }
                }
            })
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
            var findQuery = `select count(*) as count from users where username = ?`;
            connection.query(findQuery, [username], function(err, results, fields){
                if (err) {return done(err)};
                // username already taken
                if(results[0].count == 1) {return done(null, false, req.flash("error", "username has been taken"));}
                // username not taken
                if (results[0].count == 0) {
                    var token_id = CryptoJS.AES.encrypt(username, password).toString();
                    console.log(token_id);
                    var insertQuery = `insert into users(username, pword, token_id)
                    values (?, ?, ?)`;
                    connection.query(insertQuery, 
                        [username, password, token_id], 
                        function(err, results, fields){
                            if(err) {return done(err);}
                            var findQuery = `select * from users where username = ?`;
                            connection.query(findQuery, [username], function(err, results){
                                if(err) {return done(err);}
                                console.log("user signed up");
                                var user = results[0]; // user data in RowDataPacket Object form
                                return done(null, user); // pass user data query from db to req.user
                            });
                    });
                }
            });
        }
    ));
    // When user authenticaticates successfully (either sign up or sign in),
    // the user's token_id (to be randomised) will be stored in the session on server
    // and cookie on client so next time the user will be logged in automatically.
    // this is because server with a working session ID will check against the cookie from 
    // client's request and authenticate.
    // if user log out, the session expires and user is no longer authenticated. The 
    // whole process has to repeat..
    passport.serializeUser(
        function(user, done){
            console.log("user serialized")
            done(null, user.token_id); 
        });
    passport.deserializeUser(
        function(id, done){
            var findQuery = `select * from users where token_id = ?`;
            connection.query(findQuery, [id], function(err, results){
                if(err) {return done(err);}
                console.log("user deserialized");
                var user = results[0];
                done(null, user);
            });
        });
};
