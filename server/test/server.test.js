require("../config/config");
const expect = require("expect");
const request = require("supertest");
const { populateUsers, users } = require("./seed/seed");

let { app } = require("../server");
let User = require("../../models/User");

beforeEach(populateUsers);
// beforeEach(populateProfiles);
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
describe("POST /Profile Create profile", () => {
  it("Should create a profile for a user", done => {
    request(app)
      .post("api/profile")
      .send({
        handle: "johnMoe",
        status: "Programmer",
        skills: "JavaScript,PHP,Ajax,Angular",
        twitter: "https://twitter.com/johnMoe",
        linkedin: "https://linkedin.com/johnMoe",
        githubusername: "johnMoe",
        website: "https://johnmoe.gov",
        company: "Johnsons",
        youtube: "https://youtube.com/chanell/johnmoe"
      })
      .set("Authorization", users[0].token)
      .expect(200)
      .expect(res => {
        expect(res.skills).to.have.length(4);
        expect(res.social.twitter).toBe("https://twitter.com/johnMoe");
        expect(res.social.linkedin).toBeTruthy();
        expect(res.social.youtube).toBeTruthy();
        expect(res.handle).toBeTruthy();
        expect(res.status).toBeTruthy();
      });
    done();
  });
  it("Should not create a profile with the same handle", done => {
    request(app)
      .post("api/profile")
      .send({
        handle: "johnMoe",
        status: "Programmer",
        skills: "JavaScript,PHP,Ajax,Angular",
        twitter: "https://twitter.com/johnMoe",
        linkedin: "https://linkedin.com/johnMoe",
        githubusername: "johnMoe",
        website: "https://johnmoe.gov",
        company: "Johnsons",
        youtube: "https://youtube.com/chanell/johnmoe"
      })
      .set("Authorization", users[0].token)
      .expect(400);
    done();
  });
  it("Should not create a profile without any Authorization", done => {
    request(app)
      .post("api/profile")
      .send({
        handle: "asfasfaf",
        status: "Programmer",
        skills: "JavaScript,PHP,Ajax,Angular",
        twitter: "https://twitter.com/johnMoe",
        linkedin: "https://linkedin.com/johnMoe",
        githubusername: "johnMoe",
        website: "https://johnmoe.gov",
        company: "Johnsons",
        youtube: "https://youtube.com/chanell/johnmoe"
      })
      .expect(400);
    done();
  });
  it("Should update a profile for a user", done => {
    request(app)
      .post("api/profile")
      .send({
        handle: "joedoe",
        status: "Manager",
        skills: "JavaScript,PHP,Ajax,Angular,Java",
        twitter: "https://twitter.com/joemoe",
        linkedin: "https://linkedin.com/johnMoe",
        githubusername: "johnMoe",
        website: "https://johnmoe.gov",
        company: "Johnsons",
        youtube: "https://youtube.com/chanell/johnmoe"
      })
      .set("Authorization", users[0].token)
      .expect(200)
      .expect(res => {
        expect(res.skills).to.have.length(5);
        expect(res.social.twitter).toBe("https://twitter.com/joemoe");
        expect(res.social.linkedin).toBeTruthy();
        expect(res.social.youtube).toBeTruthy();
        expect(res.handle).toBeTruthy();
        expect(res.handle).toBe("joedoe");
        expect(res.status).toBe("Manager");
        expect(res.status).toBeTruthy();
      });
    done();
  });
  it("Should return all the profiles", done => {
    request(app)
      .get("api/profile/all")
      .expect(200)
      .expect(res => {
        expect(res).to.have.length(1);
      });
    done();
  });
  it("Should get profile by handle", done => {
    request(app)
      .get(`api/profile/handle/joedoe`)
      .expect(200)
      .expect(res => {
        expect(res.skills).to.have.length(5);
        expect(res.user._id).toBe(users[0]._id);
        expect(res.status).toBe("Manager");
      });
    done();
  });
});
