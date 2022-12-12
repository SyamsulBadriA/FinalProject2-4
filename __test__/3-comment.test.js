const request = require("supertest");
const { sequelize } = require("../models");
const jsonwebtoken = require("jsonwebtoken");
const app = require("..");

let UserId = null;
let AnotherUserId = null;
let PhotoId = null;
let CommentId = null;
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

const AnotherUserData = {
  email: "user2@test.com",
  full_name: "Super Test2",
  username: "super-test2",
  password: "qwerty123",
  profile_image_url: "https://supertestimage.com",
  age: 30,
  phone_number: 622420220754,
  createdAt: new Date(),
  updatedAt: new Date(),
};

let index = 0;

const manyPhotos = [
  {
    title: `Image ${index + 1}`,
    caption: `This is Image ${index + 1}`,
    poster_image_url: `https://image${index + 1}.com`,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: `Image ${index + 2}`,
    caption: `This is Image ${index + 2}`,
    poster_image_url: `https://image${index + 2}.com`,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: `Image ${index + 3}`,
    caption: `This is Image ${index + 3}`,
    poster_image_url: `https://image${index + 3}.com`,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let photoDatas;
beforeAll((done) => {
  sequelize.queryInterface.bulkInsert('Photos',manyPhotos, {
    returning: true
  })
  .then((result) => {
    photoDatas = result;
    for (let i = 0; i < photoDatas.length; i++) {
      photoDatas[i].UserId = UserId + 1;
    }
    PhotoId = photoDatas[0].id;
  })
  .catch(err => {
    done(err);
  })

  sequelize.queryInterface.bulkInsert('Users',[AnotherUserData], {
    returning: true
  })
  .then((result) => {
    AnotherUserId = result[0].id;
  })
  .catch(err => {
    console.error(err);
    done(err);
  })

  request(app)
  .post('/users/register')
  .send(userData)
  .end(function (err, res) {
    if(err) {
      done(err);
    }
  })

  request(app)
  .post('/users/login')
  .send({
    email: userData.email,
    password: userData.password
  })
  .end(function (err, res) {
    if(err) {
      done(err)
    }
    token = res.body.token;
    UserId = jsonwebtoken.decode(token).id;
    done();
  })
})

const CommentData = {
  comment: "test comment",
};

const OtherCommentData = [{
  comment: "Another test comment",
  createdAt: new Date(),
  updatedAt: new Date()
}];

const newCommentData = {
  comment: "new comment",
};

const commentDataEmpty = {
  comment: " ",
};

//Test Success Create Comment
describe("POST /comment", () => {
  it("should send response with 201 status code", (done) => {
    CommentData.PhotoId = PhotoId;
    request(app)
      .post("/comments")
      .set("token", token)
      .send(CommentData)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(201);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("comment.id");
        expect(res.body).toHaveProperty("comment.comment", CommentData.comment);
        expect(res.body).toHaveProperty("comment.UserId", UserId);
        expect(res.body).toHaveProperty("comment.PhotoId", CommentData.PhotoId);
        CommentId = res.body.comment.id;
        done();
      });
  });
});

// Test Fail Create Comment Not a User
describe("POST /comments", () => {
  it("should send response with 500 status code", (done) => {
    request(app)
      .post("/comments")
      .send(CommentData)
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

// Test Fail Create Comment Empty Data
describe("POST /comments", () => {
  it("should send response with 500 status code", (done) => {
    commentDataEmpty.PhotoId = PhotoId;
    request(app)
      .post("/comments")
      .set("token", token)
      .send(commentDataEmpty)
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
        expect(res.body).toHaveProperty("name", "SequelizeValidationError");
        expect(res.body).toHaveProperty(
          "errors[0].message",
          "Comment Is Required"
        );
        done();
      });
  });
});

describe("GET /comment", () => {
  it("shold send response with 200 status code and array of json", (done) => {
    request(app)
      .get("/comments")
      .set("token", token)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.status).toEqual(200);
        expect(typeof res.body).toEqual("object");
        expect(res.body.comments.length).toBe(1);
        expect(res.body).toHaveProperty("comments");
        expect(typeof res.body.comments[0]).toEqual("object");
        expect(res.body).toHaveProperty("comments[0].id");
        expect(res.body).toHaveProperty("comments[0].UserId", UserId);
        expect(res.body).toHaveProperty("comments[0].PhotoId", PhotoId);
        expect(res.body).toHaveProperty("comments[0].comment", CommentData.comment);
        expect(res.body).toHaveProperty("comments[0].User");
        expect(res.body).toHaveProperty("comments[0].Photo");
        done();
      });
  });
});

// Test Fail Get comment Not a User
describe("GET /comment", () => {
  it("should send response with 500 status code", (done) => {
    request(app)
      .get("/comments")
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

// Test Update Comment Success
describe("PUT /comment/:commentId", () => {
  it("should send response with 200 status code", (done) => {
    request(app)
      .put(`/comments/${CommentId}`)
      .set("token", token)
      .send(newCommentData)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.status).toEqual(200);
        expect(res.headers).toHaveProperty(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("comment.id", CommentId);
        expect(res.body).toHaveProperty("comment.UserId", UserId);
        expect(res.body).toHaveProperty("comment.PhotoId", PhotoId);
        expect(res.body).toHaveProperty("comment.comment", newCommentData.comment);
        done();
      });
  });
});

// Test Update Comment Fail Not User
describe("PUT /comment/:commentId", () => {
  it("should send response with 500 status code", (done) => {
    request(app)
      .put(`/comments/${CommentId}`)
      .send(newCommentData)
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

// Test Update Comment Fail Comment Not Found
describe("PUT /comment/:commentId", () => {
  it("should send response with 404 status code", (done) => {
    request(app)
      .put(`/comments/${CommentId + 1}`)
      .set("token", token)
      .send(newCommentData)
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
        expect(res.body).toHaveProperty("name", "Comment Not Found")
        expect(res.body).toHaveProperty("message", `Comment with id ${CommentId + 1} not found on Database`);
        done();
      });
  });
});

// Test Update Comment Fail Permission Error
let newCommentId
describe("PUT /comment/:commentId", () => {
  OtherCommentData[0].UserId = AnotherUserId;
  OtherCommentData[0].PhotoId = PhotoId;
  beforeAll((done) => {
    sequelize.queryInterface
    .bulkInsert('Comments', OtherCommentData, {
      returning: true
    }).then(result => {
      newCommentId = result[0].id;
      return done();
    }).catch(err => {
      console.error(err);
      done(err);
    })
  })
  it("should send response with 403 status code", (done) => {
    request(app)
      .put(`/comments/${newCommentId}`)
      .set("token", token)
      .send(newCommentData)
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
        expect(res.body).toHaveProperty("name", "Authorization Error")
        expect(res.body).toHaveProperty("message", `You Does Not Have Permission to Edit or Delete Comment with id ${newCommentId}!!!`);
        done();
      });
  });
});

// Test Delete Comment success
describe("DELETE /comments/:commentId", () => {
  it("should send response with 200 status code", (done) => {
    request(app)
      .delete(`/comments/${CommentId}`)
      .set("token", token)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.status).toEqual(200);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty(
          "message",
          "Your comment has been successfully deleted"
        );
        done();
      });
  });
});

// Test Delete Comment Fail Not User
describe("DELETE /comments/:commentId", () => {
  it("should send response with 500 status code", (done) => {
    request(app)
      .delete(`/comments/${CommentId}`)
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

// // Test Delete Comment Fail Comment Not Found
describe("DELETE /comments/:commentId", () => {
  it("should send response with 404 status code", (done) => {
    request(app)
      .delete(`/comments/${CommentId - 1}`)
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
        expect(res.body).toHaveProperty("name", "Comment Not Found");
        expect(res.body).toHaveProperty(
          "message",
          `Comment with id ${CommentId - 1} not found on Database`
        );
        done();
      });
  });
});

// Test Delete Comment Fail Comment of Other User
describe("DELETE /comments/:commentId", () => {
  it("should send response with 403 status code", (done) => {
    request(app)
      .delete(`/comments/${newCommentId}`)
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
        expect(res.body).toHaveProperty("name", "Authorization Error");
        expect(res.body).toHaveProperty(
          "message",
          `You Does Not Have Permission to Edit or Delete Comment with id ${newCommentId}!!!`
        );
        done();
      });
  });
});

afterAll((done) => {
  sequelize.queryInterface
    .bulkDelete("Comments", {})
    .then(() => {
      return done();
    })
    .catch((err) => {
      done(err);
    });

  sequelize.queryInterface
    .bulkDelete("Photos", {})
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
