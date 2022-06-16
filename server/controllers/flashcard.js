import Flashcard from "../models/flashcard.js";

export const createCard = async (req, res) => {
    console.log(req.body);
    const newCard = new Flashcard({
        front: req.body.front,
        back: req.body.back
    });
    try {
        await newCard.save();
        res.status(201).json(newCard);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

export const getCards = async (req, res) => {
    try {
        const cards = await Flashcard.find();
        res.status(200).json(cards);
    } catch (err) {
        res.status(404).json({ message: err.message});
    }
};