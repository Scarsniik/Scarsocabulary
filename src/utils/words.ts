import { ApiKanji } from "src/api/kanjis";
import { ApiVocabulary } from "src/api/vocabulary";
import { Kanji, Word } from "src/models/word";
import { isWord } from "src/utils/types";

export enum ScoreChangesType {
    Positive,
    Negative,
    Neutral,
}

const neutralScore = 6;

export function changeDataScore(word: Word, type: ScoreChangesType): Kanji | Word;
export function changeDataScore(kanji: Kanji, type: ScoreChangesType): Kanji | Word;
export function changeDataScore(data: Word | Kanji, type: ScoreChangesType): Kanji | Word {
    let newData = data;
    if (!newData.score) newData.score = neutralScore;
    switch(type) {
        case ScoreChangesType.Positive:
            newData.score++;
            break;
        case ScoreChangesType.Negative:
            newData.score--;
            break;
        case ScoreChangesType.Neutral:
            newData.score > neutralScore ?newData.score-- : newData.score++;
            break;
    }
    if (newData.score > 11) data.score = 11;
    if (newData.score < 1) data.score = 1;

    if (isWord(data)) {
        ApiVocabulary.editWord(data);
    } else {
        ApiKanji.editKanji(data);
    }
    return data;
}

export function getRandomElementWithScore<T extends Kanji | Word>(
  list: T[],
  lowestScoreProbability: number
): T {
  const minScore = 1;
  const maxScore = 11;
  const scoreRange = maxScore - minScore + 1;

  // On calcule la somme des scores pondérés pour tous les éléments de la liste
  let weightedScoreSum = 0;
  for (const item of list) {
    const score = typeof item.score === 'number' ? item.score : neutralScore;
    const weightedScore = Math.pow(scoreRange - score + minScore + 1, lowestScoreProbability);
    weightedScoreSum += weightedScore;
  }

  // On tire un nombre aléatoire compris entre 0 et la somme des scores pondérés
  const randomValue = Math.random() * weightedScoreSum;

  // On itère sur les éléments de la liste jusqu'à trouver celui qui correspond au nombre aléatoire
  let accumulatedWeightedScore = 0;
  for (const item of list) {
    const score = typeof item.score === 'number' ? item.score : neutralScore;
    const weightedScore = Math.pow(scoreRange - score + minScore + 1, lowestScoreProbability);
    accumulatedWeightedScore += weightedScore;
    if (randomValue <= accumulatedWeightedScore) {
      return item;
    }
  }

  // Si on arrive ici, c'est qu'il y a eu une erreur, par exemple si la liste est vide
  throw new Error('Could not select a random element from the list.');
}

export function selectRandomItem(list: (Kanji | Word)[]): Kanji | Word {
  let totalScore = 0;
  list.forEach((item) => {
    totalScore += 11 - (typeof item.score === 'number' ? item.score : neutralScore);
  });

  const random = Math.random() * totalScore;
  let currentScore = 0;
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const score = typeof item.score === 'number' ? item.score : neutralScore;
    currentScore += 11 - score;
    if (random <= currentScore) {
      return item;
    }
  }
  throw new Error('Could not select a random element from the list.');
}
  
export function testRandomElementWithScore(givenList?: (Kanji | Word)[], weight?: number, iteration?: number) {
    const list: (Word | Kanji)[] = givenList ?? [
      { name: "mot2", kana: "kana2", kanji: "kanji2", score: 1 },
      { name: "mot3", kana: "kana3", kanji: "kanji3", score: 2 },
      { name: "mot4", kana: "kana4", kanji: "kanji4", score: 3 },
      { name: "mot5", kana: "kana5", kanji: "kanji5", score: 4 },
      { name: "mot6", kana: "kana6", kanji: "kanji6", score: 5 },
      { name: "mot7", kana: "kana7", kanji: "kanji7", score: 6 },
      { name: "mot8", kana: "kana8", kanji: "kanji8", score: 7 },
      { name: "mot9", kana: "kana9", kanji: "kanji9", score: 8 },
      { name: "mot10", kana: "kana10", kanji: "kanji10", score: 9 },
      { name: "mot11", kana: "kana11", kanji: "kanji11", score: 10 },
      { name: "mot1", kana: "kana1", kanji: "kanji1", score: 11 },
    ];
  
    const scoresCount: number[] = Array(11).fill(0);
  
    const totalIterations = iteration ?? 100000;
  
    for (let i = 0; i < totalIterations; i++) {
      const element = getRandomElementWithScore(list, weight ?? 1);
      scoresCount[(element.score || neutralScore) - 1]++;
    }
  
    const scoresPercentages = scoresCount.map((count) =>
      Math.round((count *100) / totalIterations)
    );
  
    console.log("Scores percentages: ", scoresPercentages);

    return scoresPercentages;
}

export function getColorFromScore(score: number): string {
  // Map the score to a range between 0 and 1
  const normalizedScore = (score - 1) / 10;

  // Calculate the RGB components based on the normalized score
  const red = 255 * (1 - normalizedScore);
  const green = 255 * normalizedScore;
  const blue = 0;

  // Construct the color string in the format "rgb(r, g, b)"
  const colorString = `rgb(${red}, ${green}, ${blue})`;

  return colorString;
}
