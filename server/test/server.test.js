require("../config/config");
const expect = require("expect");
const request = require("supertest");
const { populateUsers, users } = require("./seed/seed");

let { app } = require("../server");
let User = require("../../models/User");

beforeEach(populateUsers);

describe("POST /Users Register", () => {
  it("Should register the user", done => {
    request(app)
      .post("/api/users/register")
      .send({
        name: "Arian",
        email: "thisisAn@example.com",
        password: "123123",
        password2: "123123"
      })
      .expect(200)
      .expect(res => {
        expect(res.body.email).toBe("thisisAn@example.com");
        expect(res.body._id).toBeTruthy();
      })
      .end(err => {
        if (err) return done(err);
        User.findOne({ email: "thisisAn@example.com" })
          .then(user => {
            expect(user).toBeTruthy();
            expect(user.password).not.toBe("123123");
            done();
          })
          .catch(e => done(e));
      });
  });
  it("should not register user with same email", done => {
    request(app)
      .post("/api/users/register")
      .send({
        name: "Arian",
        email: "thisisAn@example.com",
        password: "123123",
        password2: "123123"
      })
      .expect(400);
    done();
  });
});
describe("POST /User Login", () => {
  it("Should log in the user and give token", done => {
    request(app)
      .post("api/users/login")
      .send({
        email: "arian@g.com",
        password: "123123"
      })
      .expect(200)
      .expect(res => {
        expect(res.token).toBeTruthy();
      });
    done();
  });
  it("Should not log in user with wrong password", done => {
    request(app)
      .post("api/users/login")
      .send({ email: "arian@g.com", password: "1233321" })
      .expect(400)
      .expect(res => {
        expect(res.error).toBeTruthy();
        expect(res.token).toBeFalsy();
      });
    done();
  });
});
