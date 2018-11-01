const config = require("./config/config");
const express = require("express");
const mongoose = require("mongoose");

const port = process.PORT || 3000;
const app = express();

mongoose
  .connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true }
  )
  .then(
    () => {
      console.log("Db connected");
    },
    err => console.log(err)
  );

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
