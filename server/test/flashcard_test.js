import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index.js";
import Flashcard from "../models/flashcard.js"

//Assertion Style
chai.should();

chai.use(chaiHttp);

describe('Flashcard API', () => {

    // SET UP
    describe("SET UP", () => {
        before("Empty the DB", (done) => {
            Flashcard.deleteMany({}, (err) => {
                done();
            });
        });

        it("Assert the DB is empty", (done) => {
            chai.request(app)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.empty;
                    done();
                });
        });
    });

    // POST
    describe("POST", () => {
        it("POST a card1", (done) => {
            chai.request(app)
                .post("/")
                .send({
                    "front": "1 + 1 = ?",
                    "back": "2"
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });

        it("POST a card2", (done) => {
            chai.request(app)
                .post("/")
                .send({
                    "front": "Bonjour",
                    "back": "Hello"
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });

        it("POST a card3", (done) => {
            chai.request(app)
                .post("/")
                .send({
                    "front": "Au revoir",
                    "back": "See you next time!"
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });

        it("SHOULD NOT post this card without FRONT field", (done) => {
            chai.request(app)
                .post("/")
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
                .post("/")
                .send({
                    "front": "This is front"
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
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(3);
                    done();
                });
        });
    });

    // GET by id
    describe("GET By ID", () => {
        it("GET a card with the given ID", (done) => {
            let card = new Flashcard({
                front: "Computer",
                back: "Science"
            })
            card.save((err, res) => {
                chai.request(app)
                    .get("/" + card.id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('front').eql("Computer");
                        res.body.should.have.property('back').eql("Science");
                        res.body.should.have.property('recallability').eql("again");
                        res.body.should.have.property('_id').eql(card.id);
                        done();
                    });
            });
        });
    });

    // GET front
    describe("GET Front By ID", () => {
        it("GET a front of the card with the given ID", (done) => {
            let card = new Flashcard({
                front: "This is front",
                back: "This is back"
            })
            card.save((err, res) => {
                chai.request(app)
                    .get("/" + card.id + "/front")
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('string').eql("This is front");
                        done();
                    });
            });
        });
    });

    // GET back
    describe("GET Back By ID", () => {
        it("GET a back of the card with the given ID", (done) => {
            let card = new Flashcard({
                front: "This is front",
                back: "This is back"
            })
            card.save((err, res) => {
                chai.request(app)
                    .get("/" + card.id + "/back")
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('string').eql("This is back");
                        done();
                    });
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
                    .delete("/" + card.id)
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
            let card = new Flashcard({
                front: "To be updated",
                back: "Same"
            });
            card.save((err, res) => {
                chai.request(app)
                    .patch("/" + card.id + "/front")
                    .send({
                        "front": "updated!"
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('front').eql("updated!");
                        done();
                    });
            });
        });

        it("SHOULD NOT PATCH the front of a card with back input", (done) => {
            let card = new Flashcard({
                front: "To be updated",
                back: "Same"
            });
            card.save((err, res) => {
                chai.request(app)
                    .patch("/" + card.id + "/front")
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
    });

    // PATCH back
    describe("PATCH Back By ID", () => {
        it("PATCH the back of a card with the given ID and new string", (done) => {
            let card = new Flashcard({
                front: "Same",
                back: "To be updated"
            });
            card.save((err, res) => {
                chai.request(app)
                    .patch("/" + card.id + "/back")
                    .send({
                        "back": "updated!"
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('back').eql("updated!");
                        done();
                    });
            });
        });

        it("SHOULD NOT PATCH the back of a card with front input", (done) => {
            let card = new Flashcard({
                front: "Same",
                back: "To be updated"
            });
            card.save((err, res) => {
                chai.request(app)
                    .patch("/" + card.id + "/back")
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
    });

    // PATCH recallability
    describe("PATCH Recallability by ID", () => {
        it("PATCH the recallability of a card with the given ID and recallability", (done) => {
            let card = new Flashcard({
                front: "Same front",
                back: "Same back"
            })
            card.save((err, res) => {
                chai.request(app)
                    .patch("/" + card.id + "/recallability")
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
        });

        it("SHOULD NOT PATCH the recallability with a non-existing recallability", (done) => {
            let card = new Flashcard({
                front: "Same front",
                back: "Same back"
            })
            card.save((err, res) => {
                chai.request(app)
                    .patch("/" + card.id + "/recallability")
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
    });
});