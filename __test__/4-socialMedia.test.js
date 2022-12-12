const request = require("supertest");
const { sequelize } = require("../models");
const jsonwebtoken = require("jsonwebtoken");
const app = require("..");

let UserId = null;
let SocmedId = null;
let NewSocmedId = null;
let token;

const userData = {
  email: "user@test.com",
  full_name: "Super Test",
  username: "super-test",
  password: "qwerty123",
  profile_image_url: "https://supertestimage.com",
  age: 30,
  phone_number: 622420220754,
};

beforeAll((done) => {
  request(app)
    .post("/users/register")
    .send(userData)
    .end(function (err, res) {
      if (err) {
        done(err);
      }
    });

  request(app)
    .post("/users/login")
    .send({
      email: userData.email,
      password: userData.password,
    })
    .end(function (err, res) {
      if (err) {
        done(err);
      }
      token = res.body.token;
      UserId = jsonwebtoken.decode(token).id;
      done();
    });
});

const anotherSocialMediaData = [
  {
    name: "Test name",
    social_media_url: "Test social_media",
    UserId,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const SocialMediaData = {
  name: "Test name",
  social_media_url: "Test social_media",
};

const newSocialmediaData = {
  name: "New Test name",
  social_media_url: "New Test social_media",
};

const SocialMediaDataEmpty = {
  name: "",
  social_media_url: "",
};

//Test Success Create Social Media
describe("POST /socialmedias", () => {
    it("should send response with 201 status code", (done) => {
        request(app)
        .post("/socialmedias")
        .set("token", token)
        .send(SocialMediaData)
        .end(function (err, res) {
            if (err) {
            done(err);
            }
            expect(res.status).toEqual(201);
            expect(typeof res.body).toEqual("object");
            expect(typeof res.body.social_media).toEqual("object");
            expect(res.body.social_media).toHaveProperty("id");
            expect(res.body.social_media).toHaveProperty("name", SocialMediaData.name);
            expect(res.body.social_media).toHaveProperty(
            "social_media_url",
            SocialMediaData.social_media_url
            );
            expect(res.body.social_media).toHaveProperty("UserId", UserId);
            SocmedId = res.body.social_media.id;
            done();
        });
    });
});

// Test Fail Create Social Media Not a User
describe("POST /socialmedias", () => {
  it("should send response with 500 status code", (done) => {
    request(app)
      .post("/socialmedias")
      .send(SocialMediaData)
      .end(function (err, res) {
        if (err) {
          done(err);
          console.log(err);
        }
        expect(res.status).toEqual(500);
        expect(res.headers).toHaveProperty(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("name", "JsonWebTokenError");
        expect(res.body).toHaveProperty("message", "jwt must be provided");
        done();
      });
  });
});

// Test Fail Create social media Empty Data
describe("POST /socialmedias", () => {
  it("should send response with 500 status code", (done) => {
    request(app)
      .post("/socialmedias")
      .set("token", token)
      .send(SocialMediaDataEmpty)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(500);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("name", "SequelizeValidationError");
        expect(res.body).toHaveProperty(
          "errors[0].message",
          "Name Is Required"
        );
        expect(res.body).toHaveProperty(
          "errors[1].message",
          "Social Media URL Is Required"
        );
        done();
      });
  });
});

// Test
describe("GET /socialmedias", () => {
  it("shold send response with 200 status code and array of json", (done) => {
    request(app)
      .get("/socialmedias")
      .set("token", token)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.status).toEqual(200);
        expect(typeof res.body).toEqual("object");
        expect(res.body.social_medias.length).toBe(1);
        expect(typeof res.body.social_medias[0]).toEqual("object");
        expect(res.body).toHaveProperty("social_medias[0].id");
        expect(res.body).toHaveProperty("social_medias[0].name", SocialMediaData.name);
        expect(res.body).toHaveProperty("social_medias[0].social_media_url", SocialMediaData.social_media_url);
        expect(res.body).toHaveProperty("social_medias[0].UserId", UserId);
        expect(res.body).toHaveProperty("social_medias[0].User");
        done();
      });
  });
});

// Test Fail Get social media Not a User
describe("GET /socialmedias", () => {
  it("should send response with 500 status code", (done) => {
    request(app)
      .get("/socialmedias")
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(500);
        expect(res.headers).toHaveProperty(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("name", "JsonWebTokenError");
        expect(res.body).toHaveProperty("message", "jwt must be provided");
        done();
      });
  });
});

// Test Update social medias Success
describe("PUT /socialmedias/:socialMediaId", () => {
  it("should send response with 200 status code", (done) => {
    request(app)
      .put(`/socialmedias/${SocmedId}`)
      .set("token", token)
      .send(newSocialmediaData)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.status).toEqual(200);
        expect(typeof res.body).toEqual("object");
        expect(typeof res.body.social_media).toEqual("object");
        expect(res.body).toHaveProperty("social_media.id");
        expect(res.body).toHaveProperty(
          "social_media.name",
          newSocialmediaData.name
        );
        expect(res.body).toHaveProperty(
          "social_media.social_media_url",
          newSocialmediaData.social_media_url
        );
        expect(res.body).toHaveProperty("social_media.UserId", UserId);
        done();
      });
  });
});

// Test Update social media Fail Not User
describe("PUT /socialmedias/:socialMediaId", () => {
  it("should send response with 500 status code", (done) => {
    request(app)
      .put(`/socialmedias/${SocmedId}`)
      .send(newSocialmediaData)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(500);
        expect(res.headers).toHaveProperty(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("name", "JsonWebTokenError");
        expect(res.body).toHaveProperty("message", "jwt must be provided");
        done();
      });
  });
});

// Test Update Social Media Fail Social Media Not Found
describe("PUT /socialmedias/:socialmediaId", () => {
    it("should send response with 404 status code", (done) => {
      request(app)
        .put(`/socialmedias/${SocmedId + 1}`)
        .set("token", token)
        .send(newSocialmediaData)
        .end(function (err, res) {
          if (err) {
            done(err);
          }
          expect(res.status).toEqual(404);
          expect(res.headers).toHaveProperty(
            "content-type",
            "application/json; charset=utf-8"
          );
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("name", "Social Media Not Found")
          expect(res.body).toHaveProperty("message", `Social Media with id ${SocmedId + 1} not found on Database`);
          done();
        });
    });
});

// Test Update Social Media Fail Permission Error
describe("PUT /socialmedias/:socialmediaId", () => {
    beforeAll(done => {
        anotherSocialMediaData.UserId = null;
        sequelize.queryInterface
        .bulkInsert('SocialMedia', anotherSocialMediaData, {
            returning: true
        }).then(result => {
            NewSocmedId = result[0].id;
            done()
        }).catch(err => {
            console.error(err);
            done(err);
        })
    })
    it("should send response with 403 status code", (done) => {
      request(app)
        .put(`/socialmedias/${NewSocmedId}`)
        .set("token", token)
        .send(newSocialmediaData)
        .end(function (err, res) {
          if (err) {
            done(err);
          }
          expect(res.status).toEqual(403);
          expect(res.headers).toHaveProperty(
            "content-type",
            "application/json; charset=utf-8"
          );
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("name", "Authorization Error",)
          expect(res.body).toHaveProperty("message", `You Does Not Have Permission to Edit or Delete Socila Media with id ${NewSocmedId}!!!`);
          done();
        });
    });
});

// Test Delete social media success
describe("DELETE /socialmedias/:socialMediaId", () => {
  it("should send response with 200 status code", (done) => {
    request(app)
      .delete(`/socialmedias/${SocmedId}`)
      .set("token", token)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.status).toEqual(200);
        expect(res.headers).toHaveProperty(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(res.headers).toHaveProperty("content-length", "61");
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty(
          "message",
          "Your social media has been successfully deleted"
        );
        done();
      });
  });
});

// Test Delete social media Fail Not User
describe("DELETE /socialmedias/:socialMediaId", () => {
  it("should send response with 500 status code", (done) => {
    request(app)
      .delete(`/socialmedias/${SocmedId}`)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(500);
        expect(res.headers).toHaveProperty(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("name", "JsonWebTokenError");
        expect(res.body).toHaveProperty("message", "jwt must be provided");
        done();
      });
  });
});

// Test Delete social media Fail Social Media Not Found
describe("DELETE /socialmedias/:socialMediaId", () => {
    it("should send response with 404 status code", (done) => {
        request(app)
        .delete(`/socialmedias/${SocmedId - 1}`)
        .set("token", token)
        .end(function (err, res) {
            if (err) {
            done(err);
            }
            expect(res.status).toEqual(404);
            expect(res.headers).toHaveProperty(
            "content-type",
            "application/json; charset=utf-8"
            );
            expect(typeof res.body).toEqual("object");
            expect(res.body).toHaveProperty("name", "Social Media Not Found")
            expect(res.body).toHaveProperty("message", `Social Media with id ${SocmedId - 1} not found on Database`);
            done();
        });
    });
});

// Test Delete Social media Fail Social Media of Other User
describe("DELETE /socialmedias/:socialMediaId", () => {
  it("should send response with 403 status code", (done) => {
    request(app)
      .delete(`/socialmedias/${NewSocmedId}`)
      .set("token", token)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(403);
        expect(res.headers).toHaveProperty(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("name", "Authorization Error",)
        expect(res.body).toHaveProperty("message", `You Does Not Have Permission to Edit or Delete Socila Media with id ${NewSocmedId}!!!`);
        done();
      });
  });
});

afterAll((done) => {
    sequelize.queryInterface
    .bulkDelete("SocialMedia", {})
    .then(() => {
      return done();
    })
    .catch((err) => {
      done(err);
    });

    sequelize.queryInterface
    .bulkDelete("Users", {})
    .then(() => {
      return done();
    })
    .catch((err) => {
      done(err);
    });
});