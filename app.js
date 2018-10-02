var express = require("express"),
    app = express(),
    flash = require("connect-flash"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Comment = require("./models/comment"),
    passport = require("passport"),
    LocalStartegy = require("passport-local"),
    Campground = require("./models/campground"),
    User = require("./models/user"),
    methodOverride = require("method-override"),
    seedDB = require("./seeds");

//Requiring routes   
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

//console.log(process.env.DATABASEURL);
mongoose.connect('mongodb://husnain:husnain95@ds115533.mlab.com:15533/yelpcamp', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

app.locals.moment = require('moment');

//PASSPORT config
app.use(require("express-session")({
    secret: "Once again I made it!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStartegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started!");
});
