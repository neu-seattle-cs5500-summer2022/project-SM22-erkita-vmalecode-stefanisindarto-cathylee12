let chai = require("chai"),
  expect = chai.expect;
let chaiHttp = require("chai-http");
var app = require("../index.js");
const sinon = require("sinon");
const authentication = require("../middleware/authentication");

//Assertion Style
chai.should();
chai.use(chaiHttp);

// test expected values
const loginUrl = "/api/login";
const signupUrl = "/api/signup";
const viewDeckUrl = "/view-decks";
const userCredentialsLogin = {
  email: "jsmith@gmail.com",
  password: "test",
};
const incorrectPasswordLogin = {
  email: "jsmith@gmail.com",
  password: "incorrectPw",
};
const nonExistentUserLogin = {
  email: "nonexistent0-3883750932-09123@invalidemail.com",
  password: "nonexistent",
};
let randomAlphaNumeric = Array.from(Array(20), () =>
  Math.floor(Math.random() * 36).toString(36)
).join("");
const newUserCredentialsSignUp = {
  email: randomAlphaNumeric + "@gmail.com",
  password: "thisismyP4ssword!",
};
const invalidEmailSignUp = {
  email: "notAtEmail",
  password: "thisismyP4ssword!",
};
const invalidPasswordSignUp = {
  email: "newUser@gmail.com",
  password: "aaa",
};

describe("POST user log in", function () {
  this.beforeEach(() => {
    middlewareStub = sinon
      .stub(authentication, "authentication")
      .callsFake((req, res, next) => {
        next();
      });
    it("POST, valid log in credential", function (done) {
      chai.request
        .agent(app)
        .post(loginUrl)
        .send(userCredentialsLogin)
        .end(function (err, response) {
          expect(response.statusCode).to.equal(200);
          expect("Location", viewDeckUrl);
          chai
            .request(app)
            .get(viewDeckUrl)
            .end((err, res) => {
              expect(200, done);
              done();
            });
        });
    });
  });
  this.afterEach(() => {
    middlewareStub.restore();
  });

  it("POST, invalid log in password", function (done) {
    chai.request
      .agent(app)
      .post(loginUrl)
      .send(incorrectPasswordLogin)
      .end(function (err, response) {
        expect(response.statusCode).to.equal(400);
        expect("Location", loginUrl);
        response.body.should.have
          .property("message")
          .eql("Invalid credentials.");
        chai
          .request(app)
          .get(loginUrl)
          .end((err, res) => {
            expect(200, done);
            done();
          });
      });
  });

  it("POST, non-existent user log in", function (done) {
    chai.request
      .agent(app)
      .post(loginUrl)
      .send(nonExistentUserLogin)
      .end(function (err, response) {
        expect(response.statusCode).to.equal(404);
        expect("Location", loginUrl);
        response.body.should.have
          .property("message")
          .eql("User doesn't exist.");
        chai
          .request(app)
          .get(loginUrl)
          .end((err, res) => {
            expect(404, done);
            done();
          });
      });
  });
});

describe("POST sign up", function () {
  this.beforeEach(() => {
    middlewareStub = sinon
      .stub(authentication, "authentication")
      .callsFake((req, res, next) => {
        next();
      });
    it("POST, valid sign up credential", function (done) {
      chai.request
        .agent(app)
        .post(signupUrl)
        .send(newUserCredentialsSignUp)
        .end(function (err, response) {
          expect(response.statusCode).to.equal(200);
          expect("Location", viewDeckUrl);
          chai
            .request(app)
            .get(viewDeckUrl)
            .end((err, res) => {
              expect(200, done);
              done();
            });
        });
    });
  });
  this.afterEach(() => {
    middlewareStub.restore();
  });

  it("POST, existing user sign up", function (done) {
    chai.request
      .agent(app)
      .post(signupUrl)
      .send(userCredentialsLogin)
      .end(function (err, response) {
        expect(response.statusCode).to.equal(404);
        expect("Location", signupUrl);
        response.body.should.have
          .property("message")
          .eql("User already exists.");
        chai
          .request(app)
          .get(signupUrl)
          .end((err, res) => {
            expect(200, done);
            done();
          });
      });
  });

  it("POST, invalid email in sign up", function (done) {
    chai.request
      .agent(app)
      .post(signupUrl)
      .send(invalidEmailSignUp)
      .end(function (err, response) {
        expect(response.statusCode).to.equal(401);
        expect("Location", signupUrl);
        response.body.should.have
          .property("message")
          .eql("Valid email required.");
        chai
          .request(app)
          .get(signupUrl)
          .end((err, res) => {
            expect(200, done);
            done();
          });
      });
  });

  it("POST, invalid password in sign up", function (done) {
    chai.request
      .agent(app)
      .post(signupUrl)
      .send(invalidPasswordSignUp)
      .end(function (err, response) {
        expect(response.statusCode).to.equal(401);
        expect("Location", signupUrl);
        response.body.should.have
          .property("message")
          .eql("Valid password of at least 6 characters required.");
        chai
          .request(app)
          .get(signupUrl)
          .end((err, res) => {
            expect(200, done);
            done();
          });
      });
  });
});
