import { Word } from "src/models/word";

export function isWord(obj: any): obj is Word {
    return obj.hasOwnProperty('name')
      && obj.hasOwnProperty('kana')
      && obj.hasOwnProperty('kanji')
      && obj.hasOwnProperty('user_id');
}