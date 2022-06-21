// import { createRequire } from "module";
// const require = createRequire(import.meta.url);

var chai = require("chai"),
  expect = chai.expect,
  should = chai.should();
var chaiHttp = require("chai-http");
var mongoose = require("mongoose");
var server = require("../index.js");
var DeckSchema = require("../models/deck");
chai.use(chaiHttp);

// import chai from "chai";
// import chaiHttp from "chai-http";
// import server from "../index.js";
// let should = chai.should();
// chai.use(chaiHttp);

describe("Decks", function () {
  it("list first deck GET", (done) => {
    chai
      .request(server)
      .get("/decks")
      .end((err, res) => {
        res.should.have.status(200);
        should.exist(res.body);
        res.should.be.json;
        res.body[0].should.have.property("name");
        res.body[0].name.should.equal("Spanish Vocabs");
        done();
      });
  });
});
