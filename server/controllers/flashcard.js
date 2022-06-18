import Flashcard from "../models/flashcard.js";

export const createCard = async (req, res) => {
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

export const getCard = async (req, res) => {
    const { id } = req.params;
    try {
        const card = await Flashcard.findById(id);
        res.status(200).json(card);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getCards = async (req, res) => {
    try {
        const cards = await Flashcard.find();
        res.status(200).json(cards);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getFront = async (req, res) => {
    const { id } = req.params;
    try {
        const card = await Flashcard.findById(id);
        res.status(200).json(card.front);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getBack = async (req, res) => {
    const { id } = req.params;
    try {
        const card = await Flashcard.findById(id);
        res.status(200).json(card.back);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const deleteCard = async (req, res) => {
    const {id} = req.params;
    try {
        await Flashcard.findByIdAndRemove(id);
        res.status(200).json({ message: "Card deleted successfully" });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const updateFront = async (req, res) => {
    const {id} = req.params;
    try {
        const card = await Flashcard.findById(id);
        card.front = req.body.front;
        await card.save();
        res.status(200).json(card)
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const updateBack = async (req, res) => {
    const {id} = req.params;
    try {
        const card = await Flashcard.findById(id);
        card.back = req.body.back;
        await card.save();
        res.status(200).json(card)
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const updateRecallability = async (req, res) => {
    const {id} = req.params;
    try {
        const card = await Flashcard.findById(id);
        card.recallability = req.body.recallability;
        await card.save();
        res.status(200).json(card)
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};