const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Connecting to DB
mongoose.connect(process.env.MANSION_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Importing routes
const posts = require("./routes/posts");
const users = require("./routes/users");
const auth = require("./routes/auth");

// Routes
app.use("/api/posts", posts);
app.use("/api/users", users);
app.use("/api/auth", auth);

module.exports = app;
