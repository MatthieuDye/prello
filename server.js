// Dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const prelloRoutes = express.Router();
const path = require("path")

const PORT = process.env.PORT || 5000;
const MONGODB_URI = "mongolab-transparent-07367";

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client", "build")))

const users = require("./routes/api/users");
const team = require("./routes/api/team");
const boardsRouter = require('./routes/BoardsRoutes');
const listsRouter = require('./routes/ListsRoutes');
const cardsRouter = require('./routes/CardsRoutes');
const labelsRouter = require('./routes/LabelsRoutes');

mongoose.connect(process.env.MONGODB_URI ||'mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });

const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})


app.use("/api/users", users);
app.use("/api/team", team);
app.use('/api/boards', boardsRouter);
app.use('/api/lists', listsRouter);
app.use('/api/cards', cardsRouter);
app.use('/api/labels', labelsRouter);
app.use('/api/*', function(req, res) {
    res.status(404).json({message : 'Resource not found on this server'});
});


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});


app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});