const express = require("express");

const port = process.PORT || 3000;
const app = express();

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
