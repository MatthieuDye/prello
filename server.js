const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require("path")

const users = require("./routes/api/users");
const team = require("./routes/api/team");

const PORT = process.env.PORT || 5000;
const MONGODB_URI = "mongolab-transparent-07367";

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client", "build")))

mongoose.connect(process.env.MONGODB_URI ||'mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });

const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
});
app.get('/', function (req, res) {
    res.send('Hello World')
  })
app.use("/api/users", users);
app.use("/api/team", team);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});