require("./config/config");
require("./db");
const express = require("express");
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");

// Routes
const users = require("./../routes/api/users");
const profile = require("./../routes/api/profile");
const posts = require("./../routes/api/posts");

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("hello");
});

// Use Routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/profile", profile);

app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = { app };
