let chai = require("chai"),
  should = chai.should();
let chaiHttp = require("chai-http");
let server = require("../index.js");
chai.use(chaiHttp);

//Assertion Style
chai.should();

chai.use(chaiHttp);

// test expected values
const testDeckName = "Spanish Vocabs";
let testDeckId;
const invalidId = "123";
const invalidIdErrorMessage = "Deck with ID " + invalidId + " not found";
const invalidNameMessage = "Valid name required";
const emptyNameErrorMessage = "Name cannot be empty"

describe("POST Decks", function () {
  it("POST, add one test deck and DELETE", function (done) {
    chai
      .request(server)
      .post("/api/decks")
      .send({ name: "test deck" })
      .end(function (err, res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.have.property("name");
        res.body.name.should.equal("test deck");
        chai
          .request(server)
          .delete("/api/decks/" + res.body._id)
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
      .post("/api/decks")
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
      .post("/api/decks")
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
      .post("/api/decks")
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
      .post("/api/decks")
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
  it("GET, get decks in db", (done) => {
    chai
      .request(server)
      .post("/api/decks")
      .send({ name: testDeckName })
      .end(function (err, res) {
        res.should.have.status(201);
        testDeckId = res.body._id;
        let deck = res.body
        chai
          .request(server)
          .get("/api/decks")
          .end((err, res) => {
            res.should.have.status(200);
            should.exist(deck);
            res.should.be.json;
            done();
          });
      });
  });

  it("GET, get deck by ID", (done) => {
    chai
      .request(server)
      .get("/api/decks/" + testDeckId)
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
      .get("/api/decks/" + invalidId)
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
      .patch("/api/decks/" + testDeckId)
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
      .patch("/api/decks/" + testDeckId)
      .send({ name: "Spanish Vocabs!" })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("name").eql("Spanish Vocabs!");
        done();
      });
  });

  it("PATCH, error update deck with invalid id", (done) => {
    chai
      .request(server)
      .patch("/api/decks/" + invalidId)
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
      .patch("/api/decks/" + testDeckId)
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
      .patch("/api/decks/" + testDeckId)
      .send({ name: ">!" })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Valid name required");
        done();
      });
  });
});

describe("DELETE Deck", function () {
  it("DELETE, test deck with invalid ID", function (done) {
    chai
      .request(server)
      .delete("/api/decks/" + invalidId)
      .end(function (err, res) {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have
          .property("message")
          .eql(invalidIdErrorMessage);
        done();
      });
  });
  it("DELETE, test deck with valid ID", function (done) {
    chai
      .request(server)
      .delete("/api/decks/" + testDeckId)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Deck deleted");
        done();
      });
  });
});

let practiceDeckId;
describe("Practice cards", function () {
  it("CREATE a test deck for practice", function (done) {
    chai
      .request(server)
      .post("/api/decks/")
      .send({ name: "test deck for practice" })
      .end(function (err, res) {
        res.should.have.status(201);
        practiceDeckId = res.body["_id"];
        done();
      });
  });

  it("again, repetition: 0, interval: 0 => interval: 1", function (done) {
    let cardId;
    chai
      .request(server)
      .post("/api/decks/" + practiceDeckId + "/cards")
      .send({
        front: "front1",
        back: "back1",
      })
      .end(function (err, res) {
        res.should.have.status(201);
        res.body.should.have.property("interval").eql(0);
        res.body.should.have.property("repetition").eql(0);
        res.body.should.have.property("efactor").eql(2.5);
        cardId = res.body["_id"];
        chai
          .request(server)
          .get("/api/decks/" + practiceDeckId + "/practice")
          .end(function (err, res) {
            res.should.have.status(200);
            chai
              .request(server)
              .get("/api/decks/" + practiceDeckId + "/practice/next")
              .end(function (err, res) {
                res.should.have.status(200);
                chai
                  .request(server)
                  .get(
                    "/api/decks/" + practiceDeckId + "/cards/" + cardId
                  )
                  .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property("interval").eql(1);
                    chai
                      .request(server)
                      .delete(
                        "/api/decks/" +
                          practiceDeckId +
                          "/cards/" +
                          res.body["_id"]
                      )
                      .end(function (err, res) {
                        res.should.have.status(200);
                        done();
                      });
                  });
              });
          });
      });
  });

  it("good, repetition: 1, interval: 1 => interval: 6", function (done) {
    let cardId;
    chai
      .request(server)
      .post("/api/decks/" + practiceDeckId + "/cards")
      .send({
        front: "front2",
        back: "back2",
      })
      .end(function (err, res) {
        res.should.have.status(201);
        cardId = res.body["_id"];
        chai
          .request(server)
          .patch(
            "/api/decks/" +
              practiceDeckId +
              "/cards/" +
              res.body["_id"] +
              "/recallability"
          )
          .send({ recallability: "good" })
          .end(function (err, res) {
            res.should.have.status(200);
            chai
              .request(server)
              .get("/api/decks/" + practiceDeckId + "/practice")
              .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.have.property("repetition").eql(0);
                res.body.should.have.property("interval").eql(0);
                chai
                  .request(server)
                  .get("/api/decks/" + practiceDeckId + "/practice/next")
                  .end(function (err, res) {
                    res.should.have.status(200);
                    chai
                      .request(server)
                      .get("/api/decks/" + practiceDeckId + "/practice/next")
                      .end(function (err, res) {
                        res.should.have.status(200);
                        chai
                          .request(server)
                          .get(
                            "/api/decks/" +
                              practiceDeckId +
                              "/cards/" +
                              cardId
                          )
                          .end(function (err, res) {
                            res.should.have.status(200);
                            res.body.should.have.property("repetition").eql(2);
                            res.body.should.have.property("interval").eql(6);
                            done();
                          });
                      });
                  });
              });
          });
      });
  });

  it("Restore DB", function (done) {
    chai
      .request(server)
      .delete("/api/decks/" + practiceDeckId)
      .end(function (err, res) {
        res.should.have.status(200);
        done();
      });
  });
});
