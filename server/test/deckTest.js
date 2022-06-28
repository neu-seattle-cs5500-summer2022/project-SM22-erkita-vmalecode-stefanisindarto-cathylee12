let chai = require("chai"),
  expect = chai.expect,
  should = chai.should();
let chaiHttp = require("chai-http");
let mongoose = require("mongoose");
let server = require("../index.js");
let DeckSchema = require("../models/deck");
chai.use(chaiHttp);

//Assertion Style
chai.should();

chai.use(chaiHttp);

// test expected values
const testDeckName = "Spanish Vocabs";
const testDeckId = "62b15d18e4693d1555a5e946";
const invalidId = "123";
const invalidIdErrorMessage = "Deck with ID " + invalidId + " not found";
const invalidNameMessage = "Valid name required";
const emptyNameErrorMessage = "Name cannot be empty";

describe("POST Decks", function () {
  it("POST, add one test deck and DELETE", function (done) {
    chai
      .request(server)
      .post("/decks")
      .send({ name: "test deck" })
      .end(function (err, res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.have.property("name");
        res.body.name.should.equal("test deck");
        chai
          .request(server)
          .delete("/decks/" + res.body._id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message").eql("Deck deleted");
            done();
          });
      });
  });

  it("POST Error, test createDeck with no input", function (done) {
    chai
      .request(server)
      .post("/decks")
      .send({})
      .end(function (err, res) {
        res.should.have.status(409);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Name cannot be empty");
        done();
      });
  });

  it("POST Error, test createDeck with empty string name", function (done) {
    chai
      .request(server)
      .post("/decks")
      .send({ name: "" })
      .end(function (err, res) {
        res.should.have.status(409);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql(emptyNameErrorMessage);
        done();
      });
  });

  it("POST Error, test createDeck with whitespace string name", function (done) {
    chai
      .request(server)
      .post("/decks")
      .send({ name: " " })
      .end(function (err, res) {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql(invalidNameMessage);
        done();
      });
  });

  it("POST Error, test createDeck with special character string name", function (done) {
    chai
      .request(server)
      .post("/decks")
      .send({ name: "?!" })
      .end(function (err, res) {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql(invalidNameMessage);
        done();
      });
  });
});

describe("GET Decks", function () {
  it("GET, get first deck in db", (done) => {
    chai
      .request(server)
      .get("/decks")
      .end((err, res) => {
        res.should.have.status(200);
        should.exist(res.body);
        res.should.be.json;
        res.body[0].should.have.property("name");
        res.body[0].name.should.equal(testDeckName);
        done();
      });
  });

  it("GET, get deck by ID", (done) => {
    chai
      .request(server)
      .get("/decks/" + testDeckId)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("name");
        res.body.name.should.equal(testDeckName);
        done();
      });
  });

  it("GET Error, get deck by invalid ID", (done) => {
    chai
      .request(server)
      .get("/decks/" + invalidId)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql(invalidIdErrorMessage);
        done();
      });
  });
});

describe("PATCH Deck name", function () {
  it("PATCH, update test deck name", (done) => {
    chai
      .request(server)
      .patch("/decks/" + testDeckId)
      .send({ name: "Spanish Vocab 1" })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("name").eql("Spanish Vocab 1");
        done();
      });
  });
});

describe("PATCH Deck name", function () {
  it("PATCH, update test deck name with special character", (done) => {
    chai
      .request(server)
      .patch("/decks/" + testDeckId)
      .send({ name: "Spanish Vocabs!" })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("name").eql("Spanish Vocabs!");
        done();
      });
  });

  it("Revert for future test purposes", (done) => {
    chai
      .request(server)
      .patch("/decks/" + testDeckId)
      .send({ name: testDeckName })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("name").eql(testDeckName);
        done();
      });
  });

  it("PATCH, error update deck with invalid id", (done) => {
    chai
      .request(server)
      .patch("/decks/" + invalidId)
      .send({ name: "failed patch" })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql(invalidIdErrorMessage);
        done();
      });
  });

  it("PATCH, error update deck with invalid whitespace name", (done) => {
    chai
      .request(server)
      .patch("/decks/" + testDeckId)
      .send({ name: "   " })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Valid name required");
        done();
      });
  });

  it("PATCH, error update deck with invalid special character name", (done) => {
    chai
      .request(server)
      .patch("/decks/" + testDeckId)
      .send({ name: ">!" })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Valid name required");
        done();
      });
  });
});

describe("DELETE Invalid Decks", function () {
  it("DELETE, test deck with invalid ID", function (done) {
    chai
      .request(server)
      .delete("/decks/" + invalidId)
      .end(function (err, res) {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have
          .property("message")
          .eql("Could not delete deck with invalid ID: " + invalidId);
        done();
      });
  });
});
