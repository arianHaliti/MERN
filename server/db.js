const mongoose = require("mongoose");

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
