import { ApiResult } from "src/models/api";
import { Word } from "src/models/word";
import { vocabulary } from "src/testData";

enum AddWordResult {
    Done,
    BadArguments,
    AlreadyIn,
}

function getVocabulary(): Word[] {
    return vocabulary;
}

function setVocabulary(vocabulary: Word[]): boolean {
    console.log("Nouvelle list de vocabulaire", vocabulary);
    return true;
}

function addWord(word: Word): ApiResult<Word[], AddWordResult> {
    if (word.kana === "" || word.name === "") return {status: AddWordResult.BadArguments}
    if (vocabulary.find((item) => item.name === word.name)) return {status: AddWordResult.AlreadyIn};
    vocabulary.push(word);
    return {
        status: AddWordResult.Done,
        content: vocabulary,
    };
}

export const ApiVocabulary = {
    getVocabulary,
    setVocabulary,
    addWord,
    AddWordResult,
}