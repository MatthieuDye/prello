// Swagger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDocument = YAML.load('./swagger/swagger.yaml');

// Morgan (logs)
const morgan = require('morgan');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const passport = require("passport");
require('dotenv').config();

const path = require("path")
const mapRoutes = require("express-routes-mapper");
const config = require("./config/");

//Policies
const auth = require("./config/policies/authPolicy");
const teamMember = require("./config/policies/teamMemberPolicy");
const teamAdmin = require("./config/policies/teamAdminPolicy");
const boardMember = require("./config/policies/boardMemberPolicy");
const boardAdmin = require("./config/policies/boardAdminPolicy");

const PORT = process.env.PORT || 5000;

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

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Morgan (logs)
app.use(morgan('combined'));

// Secure private routes with JWT authentication only
app.all("/api/private/*", (req, res, next) => auth(req, res, next));

// Secure board member routes with JWT authentication and board member policy
app.all(
    "/api/private/board/member/*",
    (req, res, next) => auth(req, res, next),
    (req, res, next) => boardMember(req, res, next),
);

// Secure board admin routes with JWT authentication and board admin policy
app.all(
    "/api/private/board/admin/*",
    (req, res, next) => auth(req, res, next),
    (req, res, next) => boardAdmin(req, res, next),
);

// Secure team member routes with JWT authentication and team member policy
app.all(
    "/api/private/team/member/*",
    (req, res, next) => auth(req, res, next),
    (req, res, next) => teamMember(req, res, next),
);

// Secure team admin routes with JWT authentication and team admin policy
app.all(
    "/api/private/team/admin/*",
    (req, res, next) => auth(req, res, next),
    (req, res, next) => teamAdmin(req, res, next),
);

const mappedPublicRoutes = mapRoutes(config.publicRoutes, "controllers/");
const mappedPrivateRoutes = mapRoutes(config.privateRoutes, "controllers/");
const mappedBoardMemberRoutes = mapRoutes(config.boardMemberRoutes, "controllers/");
const mappedBoardAdminRoutes = mapRoutes(config.boardAdminRoutes, "controllers/");
const mappedTeamMemberRoutes = mapRoutes(config.teamMemberRoutes, "controllers/");
const mappedTeamAdminRoutes = mapRoutes(config.teamAdminRoutes, "controllers/");


app.get('/', function (req, res) {
    res.send('Hello World')
})

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

// Express routes
app.use("/api/public/", mappedPublicRoutes);
app.use("/api/private/", mappedPrivateRoutes);
app.use("/api/private/board/member/", mappedBoardMemberRoutes);
app.use("/api/private/board/admin/", mappedBoardAdminRoutes);
app.use("/api/private/team/member/", mappedTeamMemberRoutes);
app.use("/api/private/team/admin/", mappedTeamAdminRoutes);

app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});
module.exports = app;