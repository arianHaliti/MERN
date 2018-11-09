const { ObjectID } = require("mongodb");
const User = require("../../../models/User");
const jwt = require("jsonwebtoken");
const userOneID = new ObjectID();
const userTwoID = new ObjectID();

const users = [
  {
    _id: userOneID,
    name: "User Name One",
    password: "123123",
    email: "arian@g.com",
    token: jwt
      .sign(
        {
          _id: userOneID,
          name: "User Name One",
          email: "arian@g.com"
        },
        process.env.SECRET_KEY,
        { expiresIn: 3600 }
      )
      .toString()
  },
  {
    _id: userTwoID,
    name: "User Name Two",
    password: "123123",
    email: "arian2@g.com"
  }
];

const populateUsers = done => {
  User.deleteMany({})
    .then(() => {
      let userOne = new User(users[0]).save();
      let userTwo = new User(users[1]).save();

      return Promise.all([userOne, userTwo]);
    })
    .then(() => {
      done();
    });
};

module.exports = { populateUsers, users };
