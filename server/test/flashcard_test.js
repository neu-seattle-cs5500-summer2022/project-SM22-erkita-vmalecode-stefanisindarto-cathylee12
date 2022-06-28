const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index.js");
const Flashcard = require("../models/flashcard");

//Assertion Style
chai.should();

chai.use(chaiHttp);

describe('Flashcard API', () => {

    // POST
    let cardID1;
    let cardID2;
    let cardID3;
    describe("POST", () => {

        it("POST a card1", (done) => {
            chai.request(app)
                .post("/decks/cards")
                .send({
                    "front": "1 + 1 = ?",
                    "back": "2"
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property('front').eql("1 + 1 = ?");
                    res.body.should.have.property('back').eql("2");
                    res.body.should.have.be.a('object');
                    res.body.should.have.property('_id');
                    cardID1 = res.body['_id'];
                    done();
                });
        });

        it("POST a card2", (done) => {
            chai.request(app)
                .post("/decks/cards")
                .send({
                    "front": "Bonjour",
                    "back": "Hello"
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.be.a('object');
                    res.body.should.have.property('_id');
                    cardID2 = res.body['_id'];
                    done();
                });
        });

        it("POST a card3", (done) => {
            chai.request(app)
                .post("/decks/cards")
                .send({
                    "front": "Au revoir",
                    "back": "See you next time!"
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.be.a('object');
                    res.body.should.have.property('_id');
                    cardID3 = res.body['_id'];
                    done();
                });
        });

        it("SHOULD NOT post this card without FRONT field", (done) => {
            chai.request(app)
                .post("/decks/cards")
                .send({
                    "back": "This is back"
                })
                .end((err, res) => {
                    res.should.have.status(409);
                    done();
                });
        });

        it("SHOULD NOT post this card without BACK field", (done) => {
            chai.request(app)
                .post("/decks/cards")
                .send({
                    "front": "This is front"
                })
                .end((err, res) => {
                    res.should.have.status(409);
                    done();
                });
        });

        it("SHOULD NOT post this card with an empty string", (done) => {
            chai.request(app)
                .post("/decks/cards")
                .send({
                    "front": "",
                    "back": ""
                })
                .end((err, res) => {
                    res.should.have.status(409);
                    done();
                });
        });
    });

    // GET
    describe("GET", () => {
        it("GET all the cards", (done) => {
            chai.request(app)
                .get("/decks/cards")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body[0].should.have.property('_id').eql(cardID1);
                    res.body[1].should.have.property('_id').eql(cardID2);
                    res.body[2].should.have.property('_id').eql(cardID3);
                    done();
                });
        });
    });

    // GET by id
    describe("GET By ID", () => {
        it("GET a card with the given ID", (done) => {
            chai.request(app)
                .get("/decks/cards/" + cardID1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('front').eql("1 + 1 = ?");
                    res.body.should.have.property('back').eql("2");
                    res.body.should.have.property('recallability').eql("again");
                    res.body.should.have.property('_id').eql(cardID1);
                    done();
                });
        });
    });

    // GET front
    describe("GET Front By ID", () => {
        it("GET a front of the card with the given ID", (done) => {
            chai.request(app)
                .get("/decks/cards/" + cardID1 + "/front")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('string').eql("1 + 1 = ?");
                    done();
                });
        });
    });

    // GET back
    describe("GET Back By ID", () => {
        it("GET a back of the card with the given ID", (done) => {
            chai.request(app)
                .get("/decks/cards/" + cardID1 + "/back")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('string').eql("2");
                    done();
                });
        });
    });

    // DELETE a card
    describe("DELETE By ID", () => {
        it("DELETE a card with the given ID", (done) => {
            let card = new Flashcard({
                front: "This is to be",
                back: "Deleted"
            });
            card.save((err, res) => {
                chai.request(app)
                    .delete("/decks/cards/" + card.id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql("Card deleted successfully");
                        done();
                    });
            });
        });
    });

    // PATCH front
    describe("PATCH Front By ID", () => {
        it("PATCH the front of a card with the given ID and new string", (done) => {
            chai.request(app)
                .get("/decks/cards/" + cardID1)
                .end((err, res) => {
                    res.body.should.have.property('front').eql("1 + 1 = ?");
                    res.body.should.have.property('back').eql("2");
                });
            chai.request(app)
                .patch("/decks/cards/" + cardID1 + "/front")
                .send({
                    "front": "updated!"
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('front').eql("updated!");
                    res.body.should.have.property('back').eql("2");
                    done();
                });
        });

        it("SHOULD NOT PATCH the front of a card with back input", (done) => {
            chai.request(app)
                .patch("/decks/cards/" + cardID1 + "/front")
                .send({
                    "back": "updated!"
                })
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message')
                        .eql("Flashcard validation failed: front: Path `front` is required.");
                    done();
                });
        });
    });

    // PATCH back
    describe("PATCH Back By ID", () => {
        it("PATCH the back of a card with the given ID and new string", (done) => {
            chai.request(app)
                .get("/decks/cards/" + cardID2)
                .end((err, res) => {
                    res.body.should.have.property('front').eql("Bonjour");
                    res.body.should.have.property('back').eql("Hello");
                });
            chai.request(app)
                .patch("/decks/cards/" + cardID2 + "/back")
                .send({
                    "back": "updated!"
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('front').eql("Bonjour");
                    res.body.should.have.property('back').eql("updated!");
                    done();
                });
        });

        it("SHOULD NOT PATCH the back of a card with front input", (done) => {
            chai.request(app)
                .patch("/decks/cards/" + cardID2 + "/back")
                .send({
                    "front": "updated!"
                })
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message')
                        .eql("Flashcard validation failed: back: Path `back` is required.");
                    done();
                });
        });
    });

    // PATCH recallability
    describe("PATCH Recallability by ID", () => {
        it("PATCH the recallability of a card with the given ID and recallability", (done) => {
            chai.request(app)
                .get("/decks/cards/" + cardID2)
                .end((err, res) => {
                    res.body.should.have.property('recallability').eql("again");
                });
            chai.request(app)
                .patch("/decks/cards/" + cardID2 + "/recallability")
                .send({
                    "recallability": "hard"
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('recallability').eql("hard");
                    done();
                });
        });

        it("SHOULD NOT PATCH the recallability with a non-existing recallability", (done) => {
            chai.request(app)
                .patch("/decks/cards/" + cardID2 + "/recallability")
                .send({
                    "recallability": "medium"
                })
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message')
                        .eql("Flashcard validation failed: recallability: " +
                                "`medium` is not a valid enum value for path `recallability`.");
                    done();
                });
        });
    });

    describe("Reset DB", () => {
        it("", (done) => {
            Flashcard.deleteMany({_id: [cardID1, cardID2, cardID3]}, function (err) {
                if (err) {
                    console.log(err)
                }
            });
            done();
        });
    });
});