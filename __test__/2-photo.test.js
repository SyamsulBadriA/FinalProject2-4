const request = require('supertest');
const { sequelize } = require ('../models');
const jsonwebtoken = require("jsonwebtoken");
const app = require('..');

let UserId = null;
let token;
const userData = {
    "email": "user@test.com",
    "full_name": "Super Test",
    "username": "super-test",
    "password": "qwerty123",
    "profile_image_url": "https://supertestimage.com",
    "age": 30,
    "phone_number": 622420220754
};

beforeAll((done) => {
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

const manyImageData = [
    {
        title: 'Foto pertama Milik UserID 1',
        caption: 'Ini foto pertama milik UserID 1',
        poster_image_url: 'https://photopertama.com',
        UserId,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        title: 'Foto kedua Milik UserID 1',
        caption: 'Ini foto kedua milik UserID 1',
        poster_image_url: 'https://photokedua.com',
        UserId,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        title: 'Foto ketiga Milik UserID 1',
        caption: 'Ini foto ketiga milik UserID 1',
        poster_image_url: 'https://photoketiga.com',
        UserId,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
]

const imageData = {
    poster_image_url: "https://myphoto.com",
    title: "My Photo",
    caption: "This is my Photo"
}

const newImageData = {
    poster_image_url: "https://mynewphoto.com",
    title: "My New Photo",
    caption: "This is my New Photo"
}

const imageDataEmpty = {
    poster_image_url: "",
    title: "",
    caption: ""
}

// Test Success Create Photo
let photoId = null;
describe('POST /photos', () => {
    it("should send response with 201 status code", (done) => {
        request(app)
        .post('/photos')
        .set('token', token)
        .send(imageData)
        .end(function(err, res) {
            if(err) {
                done(err);
            }
            expect(res.status).toEqual(201);
            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("id");
            expect(res.body).toHaveProperty("title", imageData.title);
            expect(res.body).toHaveProperty("caption", imageData.caption);
            expect(res.body).toHaveProperty("poster_image_url", imageData.poster_image_url);
            expect(res.body).toHaveProperty("UserId", UserId);
            photoId = res.body.id;
            done();
        });
    });
});

// Test Fail Create Photo Not a User
describe('POST /photos', () => {
    it("should send response with 500 status code", (done) => {
        request(app)
        .post('/photos')
        .send(imageData)
        .end(function(err, res) {
            if(err) {
                done(err)
                console.log(err)
            };
            expect(res.status).toEqual(500);
            expect(res.headers).toHaveProperty("content-type", "application/json; charset=utf-8")
            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("name", "JsonWebTokenError");
            expect(res.body).toHaveProperty("message", "jwt must be provided");
            done();
        });
    });
});

// Test Fail Create Photo Empty Data
describe('POST /photos', () => {
    it("should send response with 500 status code", (done) => {
        request(app)
        .post('/photos')
        .set('token', token)
        .send(imageDataEmpty)
        .end(function(err, res) {
            if(err) {
                done(err);
            }
            expect(res.status).toEqual(500);
            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("name", "SequelizeValidationError");
            expect(res.body).toHaveProperty("errors[0].message", "Title Is Required");
            expect(res.body).toHaveProperty("errors[1].message", "Caption Is Required");
            expect(res.body).toHaveProperty("errors[2].message", "Poster Image URL Is Required");
            done();
        });
    });
});


describe('GET /photos', () => {
    it('shold send response with 200 status code and array of json', (done) => {
        request(app)
        .get('/photos')
        .set('token', token)
        .end(function(err, res) {
            if(err) done(err);
            expect(res.status).toEqual(200);
            expect(typeof res.body).toEqual("object");
            expect(res.body.photos.length).toBe(1);
            expect(res.body).toHaveProperty("photos")
            expect(typeof res.body.photos[0]).toEqual("object");
            expect(res.body).toHaveProperty("photos[0].id", photoId);
            expect(res.body).toHaveProperty("photos[0].caption", imageData.caption);
            expect(res.body).toHaveProperty("photos[0].poster_image_url", imageData.poster_image_url);
            expect(res.body).toHaveProperty("photos[0].UserId", UserId);
            expect(res.body).toHaveProperty("photos[0].Comments");
            expect(res.body).toHaveProperty("photos[0].User");
            done();
        });
    });
});

// Test Fail Get Photo Not a User
describe('GET /photos', () => {
    it("should send response with 500 status code", (done) => {
        request(app)
        .get('/photos')
        .end(function(err, res) {
            if(err) {
                done(err)
            };
            expect(res.status).toEqual(500);
            expect(res.headers).toHaveProperty("content-type", "application/json; charset=utf-8")
            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("name", "JsonWebTokenError");
            expect(res.body).toHaveProperty("message", "jwt must be provided");
            done();
        });
    });
});

// Test Update Photo Success
describe('PUT /photos/:photoId', () => {
    it("should send response with 200 status code", (done) => {
        request(app)
        .put(`/photos/${photoId}`)
        .set('token', token)
        .send(newImageData)
        .end(function(err, res) {
            if(err) done(err);
            expect(res.status).toEqual(200);
            expect(typeof res.body).toEqual("object");
            expect(res.body).toHaveProperty("photo.id", photoId);
            expect(res.body).toHaveProperty("photo.title", newImageData.title);
            expect(res.body).toHaveProperty("photo.caption", newImageData.caption);
            expect(res.body).toHaveProperty("photo.poster_image_url", newImageData.poster_image_url);
            expect(res.body).toHaveProperty("photo.UserId", UserId);
            done();
        });
    });
});

// Test Update Phptp Fail Not User
describe('PUT /photos/:photoId', () => {
    it("should send response with 500 status code", (done) => {
        request(app)
        .put(`/photos/${photoId}`)
        .send(newImageData)
        .end(function(err, res) {
            if(err) {
                done(err)
            };
            expect(res.status).toEqual(500);
            expect(res.headers).toHaveProperty("content-type", "application/json; charset=utf-8")
            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("name", "JsonWebTokenError");
            expect(res.body).toHaveProperty("message", "jwt must be provided");
            done();
        });
    });
});

// Test Update Photo Fail Photo Not Found
describe('PUT /photos/:photoId', () => {
    it("should send response with 404 status code", (done) => {
        request(app)
        .put(`/photos/${photoId + 1}`)
        .set('token', token)
        .send(newImageData)
        .end(function(err, res) {
            if(err) {
                done(err)
            };
            expect(res.status).toEqual(404);
            expect(res.headers).toHaveProperty("content-type", "application/json; charset=utf-8")
            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("name", "Photo Not Found");
            expect(res.body).toHaveProperty("message", `Photo with id "${photoId + 1}" not found on Database`);
            done();
        });
    });
});

// Test Update Photo Fail Photo of Other User
describe('PUT /photos/:photoId', () => {
    beforeAll((done) => {
        sequelize.queryInterface.bulkInsert('Photos',manyImageData, {})
        .then(() => {
            return done();
        })
        .catch(err => {
            done(err);
        })
    });
    it("should send response with 403 status code", (done) => {
        request(app)
        .put(`/photos/${photoId + 1}`)
        .set('token', token)
        .send(newImageData)
        .end(function(err, res) {
            if(err) {
                done(err)
            };
            expect(res.status).toEqual(403);
            expect(res.headers).toHaveProperty("content-type", "application/json; charset=utf-8")
            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("name", "Authorization Error");
            expect(res.body).toHaveProperty("message", `You Does Not Have Permission to Edit or Delete Photo with id ${photoId + 1}!!!`);
            done();
        });
    });
});

// Test Delete Photo Success
describe('DELETE /photos/:photoId', () => {
    it("should send response with 200 status code", (done) => {
        request(app)
        .delete(`/photos/${photoId}`)
        .set('token', token)
        .end(function(err, res) {
            if(err) done(err);
            expect(res.status).toEqual(200);
            expect(res.headers).toHaveProperty("content-type", "application/json; charset=utf-8")
            expect(res.headers).toHaveProperty("content-length", "54")
            expect(typeof res.body).toEqual("object");
            expect(res.body).toHaveProperty("message", "Your photo has been successfully deleted");
            done();
        });
    });
});

// Test Delete Photo Fail Not User
describe('DELETE /photos/:photoId', () => {
    it("should send response with 500 status code", (done) => {
        request(app)
        .delete(`/photos/${photoId}`)
        .end(function(err, res) {
            if(err) {
                done(err)
            };
            expect(res.status).toEqual(500);
            expect(res.headers).toHaveProperty("content-type", "application/json; charset=utf-8")
            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("name", "JsonWebTokenError");
            expect(res.body).toHaveProperty("message", "jwt must be provided");
            done();
        });
    });
});

// Test Delete Photo Fail Photo Not Found
describe('DELETE /photos/:photoId', () => {
    it("should send response with 404 status code", (done) => {
        request(app)
        .delete(`/photos/${photoId - 1}`)
        .set('token', token)
        .end(function(err, res) {
            if(err) {
                done(err)
            };
            expect(res.status).toEqual(404);
            expect(res.headers).toHaveProperty("content-type", "application/json; charset=utf-8")
            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("name", "Photo Not Found");
            expect(res.body).toHaveProperty("message", `Photo with id "${photoId - 1}" not found on Database`);
            done();
        });
    });
});

// Test Delete Photo Fail Photo of Other User
describe('DELETE /photos/:photoId', () => {
    beforeAll((done) => {
        sequelize.queryInterface.bulkInsert('Photos',manyImageData, {})
        .then(() => {
            return done();
        })
        .catch(err => {
            done(err);
        })
    });
    it("should send response with 403 status code", (done) => {
        request(app)
        .delete(`/photos/${photoId + 1}`)
        .set('token', token)
        .end(function(err, res) {
            if(err) {
                done(err)
            };
            expect(res.status).toEqual(403);
            expect(res.headers).toHaveProperty("content-type", "application/json; charset=utf-8")
            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("name", "Authorization Error");
            expect(res.body).toHaveProperty("message", `You Does Not Have Permission to Edit or Delete Photo with id ${photoId + 1}!!!`);
            done();
        });
    });
});

afterAll((done) => {
    sequelize.queryInterface.bulkDelete('Photos', {})
    .then(() => {
        return done();
    })
    .catch(err => {
        done(err);
    })
});