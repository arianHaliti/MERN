require("../config/config");
const expect = require("expect");
const request = require("supertest");
const { populateUsers, users } = require("./seed/seed");

let { app } = require("../server");
let User = require("./../../models/User");
let Profile = require("./../../models/Profile");
let Post = require("./../../models/Post");

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
        email: "arian@g.com",
        password: "123123",
        password2: "123123"
      })
      .expect(400)
      .end(done);
  });
});
describe("POST /User Login", () => {
  it("Should log in the user and give token", done => {
    request(app)
      .post("/api/users/login")
      .send({
        password: "123123",
        email: "arian@g.com"
      })
      .expect(200)
      .expect(res => {
        expect(res.token).toBeTruthy();
      })
      .end(done);
  });
  it("Should not log in user with wrong password", done => {
    request(app)
      .post("/api/users/login")
      .send({ email: "arian@g.com", password: "1233321" })
      .expect(404)
      .expect(res => {
        expect(res.error).toBeTruthy();
        expect(res.token).toBeFalsy();
      })
      .end(done);
  });
});
describe("POST /Profile Create profile", () => {
  it("Should create a profile for a user", done => {
    console.log(users[0].token);
    request(app)
      .post("/api/profile")
      .set("Authorization", users[0].token)
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
      .expect(200)
      .expect(res => {
        expect(res.skills.length).toBe(4);
        expect(res.social.twitter).toBe("https://twitter.com/johnMoe");
        expect(res.social.linkedin).toBeTruthy();
        expect(res.social.youtube).toBeTruthy();
        expect(res.handle).toBeTruthy();
        expect(res.status).toBeTruthy();
      })
      .end(done);
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
      .expect(401);
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

  describe("POST profile/experience create Experience", () => {
    it("should  create experience for user", done => {
      request(app)
        .post("api/profile/experience")
        .send({
          title: "Backend Dev",
          company: "3cis",
          from: "12-12-2011",
          description: "Worked as a backend dev"
        })
        .set("Authorization", users[0].token)
        .expect(200)
        .expect(res => {
          expect(res.experience[0].length).toBe(6);
          expect(res.experience[0].title).toBe("Backend Dev");
          expect(res.experience[0].company).toBeTruthy();
          expect(res.experience[0].from).toBeTruthy();
          expect(res.experience[0].titles).toBeTruthy();
        });
      done();
    });
    it("should not create experience for user without filling the fields", done => {
      request(app)
        .post("api/profile/experience")
        .set("Authorization", users[0].toke)
        .expect(400)
        .expect(res => {
          expect(res.title).toBe("Job title is required");
          expect(res.company).toBe("Company name is required");
          expect(res.title).toBe("Date when started is required");
        });
      done();
    });
    it("should not create experience for user without token", done => {
      request(app)
        .post("api/profile/experience")
        .expect(401);
      done();
    });
  });
  describe("POST /education create Education", () => {
    it("should  create education for user", done => {
      request(app)
        .post("api/profile/education")
        .send({
          school: "UBT",
          degree: "Software Engenieer",
          from: "09-03-2011",
          fieldofstudy: "Computer Scienece"
        })
        .set("Authorization", users[0].token)
        .expect(200)
        .expect(res => {
          expect(res.experience[0].length).toBe(6);
          expect(res.experience[0].school).toBe("UBT");
          expect(res.experience[0].degree).toBeTruthy();
          expect(res.experience[0].from).toBeTruthy();
          expect(res.experience[0].fieldofstudy).toBeTruthy();
        });
      done();
    });
    it("should not create education for user without filling the fields", done => {
      request(app)
        .post("api/profile/education")
        .set("Authorization", users[0].toke)
        .expect(400)
        .expect(res => {
          expect(res.school).toBe("School field is required");
          expect(res.degree).toBe("Degree field is required");
          expect(res.fieldofstudy).toBe("Field of Study is required");
          expect(res.from).toBe("date started is required");
        });
      done();
    });
    it("should not create education for user without token", done => {
      request(app)
        .post("api/profile/education")
        .expect(401);
      done();
    });
  });
  describe("DELETE /experience/:exp_id deletes experience", () => {
    it("should delete experience", done => {
      let exp_id = "";
      Profile.findOne({ user: users[0]._id })
        .then(profile => {
          exp_id = profile.experience[0]._id;
          request(app)
            .delete(`api/profile/experience/${exp_id}`)
            .set("Authorization", users[0].token)
            .expect(200);
          done();
        })
        .catch(e => {
          expect(400);
          done();
        });
    });
    it("should not delete experience without token", done => {
      request(app)
        .delete(`api/profile/experience/124211411}`)
        .expect(400);
      done();
    });
  });
  describe("DELETE /education/:edu_id deletes education", () => {
    it("should delete education", done => {
      let edu_id = "";
      Profile.findOne({ user: users[0]._id })
        .then(profile => {
          edu_id = profile.education[0]._id;
          request(app)
            .delete(`api/profile/education/${edu_id}`)
            .set("Authorization", users[0].token)
            .expect(200);
          done();
        })
        .catch(e => {
          expect(400);
          done();
        });
    });
    it("should not delete education without token", done => {
      request(app)
        .delete(`api/profile/education/124211411}`)
        .expect(400);
      done();
    });
  });
});
describe("POST router", () => {
  let post_id;
  it("Should create a post", done => {
    request(app)
      .post("api/posts")
      .send({ text: "TestPost" })
      .set("Authorization", users[0].token)
      .expect(200)
      .expect(res => {
        expect(res.text).toBe("TestPost");
        post_id = res._id;
      });
    done();
  });
  it("Should not create a post", done => {
    request(app)
      .post("api/posts")
      .send({ text: "TestPost" })
      .expect(401);
    done();
  });
  it("Should get all the posts", done => {
    request(app)
      .get("api/posts/")
      .expect(200)
      .expect(res => {
        exepect(res).to.have.length(1);
      });
    done();
  });
  it("Should get one post", done => {
    request(app)
      .get("api/posts/" + post_id)
      .expect(400)
      .expect(res => {
        exepect(res).to.have.length(1);
        expect(res.text).toBe("TestPost");
        expect(res[0].user).toBe(users[0]._id);
      });

    done();
  });
  it("Should not get one post", done => {
    request(app)
      .get("api/posts/dsadasddsasaad")
      .expect(400)
      .expect(res => {
        exepect(res.message).toBe("Post not found");
      });
    done();
  });
});
