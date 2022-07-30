/*
Algorithm from "Supermemo" package
*/

module.exports = function intervalCalculator(card) {
  let grade = 2;
  if (card.recallability == "hard") {
    grade = 0;
  } else if (card.recallability == "good") {
    grade = 3;
  } else if (card.recallability == "easy") {
    grade = 5;
  }

  let nextInterval;
  let nextRepetition;
  let nextEfactor;

  if (grade >= 3) {
    if (card.repetition === 0) {
      nextInterval = 1;
      nextRepetition = 1;
    } else if (card.repetition === 1) {
      nextInterval = 6;
      nextRepetition = 2;
    } else {
      nextInterval = Math.round(card.interval * card.efactor);
      nextRepetition = card.repetition + 1;
    }
  } else {
    nextInterval = 1;
    nextRepetition = 0;
  }

  nextEfactor =
    card.efactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));

  if (nextEfactor < 1.3) nextEfactor = 1.3;

  return { nextInterval, nextRepetition, nextEfactor };
}
