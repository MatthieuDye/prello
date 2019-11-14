const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const keys = require("./config/keys");
const path = require("path");
const mapRoutes = require("express-routes-mapper");
const auth = require("./config/policies/authPolicy");
const config = require("./config");
const passport = require("passport");
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = "mongolab-transparent-07367";

app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client", "build")))

mongoose.connect(process.env.MONGODB_URI ||'mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });

const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
});
app.use(passport.initialize());
app.use(passport.session());

// Passport config
require("./config/passport")(passport);

// Secure private routes with JWT authentication only
app.all("/api/private/*", (req, res, next) => auth(req, res, next));

app.get(
    "/api/public/user/auth/google",
    passport.authenticate("google", { scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"] })
);

app.get('/api/public/user/auth/google/callback', passport.authenticate('google', { session: false }), async (req, res) => {
    try {
        const user = req.user;
        console.log("ici : " + user);

        const payload = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            email: user.email
        };

       jwt.sign(
            payload,
            process.env.SECRET_TOKEN,
            {
                expiresIn: 3600 // 1 hour in seconds
            },
            (err, token) => {
                console.log("before : " + token);
                res.redirect(`${process.env.CLIENT_URI}/login?token=${token}`);
            }
        );

    } catch (e) {
       console.log("error")
    }
});



const mappedPublicRoutes = mapRoutes(config.publicRoutes, "controllers/");
const mappedPrivateRoutes = mapRoutes(config.privateRoutes, "controllers/");

// Express routes
app.use("/api/public/", mappedPublicRoutes);
app.use("/api/private/", mappedPrivateRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});