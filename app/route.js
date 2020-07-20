// set up route for our app, in conjuction with passport

module.exports = function(app, passport){
    // Routing goes here

    // Log in
    app.get("/login", function(req, res){
        res.render("../public/views/login", {message: req.flash("error")}); // message is null in the beginning when user has not submit sign up
    });

    app.post("/login", 
    passport.authenticate("local-login",{
        successRedirect: "/profile",
        failureRedirect: "/login", // Combine with GET method to display flash message is a good idea here
        session: true,
        failureFlash: true
    }),
    function(req, res){
        // res.json({username: req.user.username, password: req.user.password});
        res.render("../public/views/profile", {user: JSON.stringify(req.user)});
        // res.send("Log in successful!");
        
    });

    // redirect to home page after log out session
    app.get("/logout", 
    function(req, res){
        req.logout();
        if(!req.isAuthenticated()){
            res.render("../public/views/home");
        }
    });

    // sign up
    app.get("/signup", 
    function(req, res) {
        res.render("../public/views/signup", {message: req.flash("error")});
    }); // GET method looks for the first argument where href value in anchor tags matches

    app.post("/signup", 
    passport.authenticate("local-signup",{
        successRedirect: "/profile",
        failureRedirect: "/signup",
        session: true,
        failureFlash: true
    }), // POST method looks for the first param where the value of the action attribute in form field matches
    function(req, res){
        // if(req.isAuthenticated()) {res.render("../public/views/profile", {user: req.user});}
        // else {res.render("../public/views/signup", {message: req.flash("error")});}
        res.render("../public/views/profile", {user: JSON.stringify(req.user)});
    }
    );

    // Handle unmatched route
    // Persistent log in 
    app.get("*", function(req, res){
        if(req.isAuthenticated()) {res.render("../public/views/profile", {user: JSON.stringify(req.user)});}
        else {res.render("../public/views/home");}
    });
    
};