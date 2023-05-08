import { JishoAPIResult, KanjiParseResult } from "unofficial-jisho-api";

export interface Word {
    _id?: string;
    name: string;
    kana: string;
    kanji: string;
    tags?: string[];
    score?: number;
    kanjiScore?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface Kanji {
    _id?: string;
    name: string;
    kanji: string;
    score?: number;
    createdAt?: string;
    updatedAt?: string;
}

export type LanguageItem = Kanji | Word;

export interface Tag {
    _id?: string;
    name: string;
    user_id?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface WordAndData {
    word: Word;
    data: JishoAPIResult;
}

export interface KanjiAndData {
    kanji: Kanji;
    data: KanjiParseResult;
}

// Request Kanji tout ça

export type Sense = {
    english_definitions: string[];
    parts_of_speech: string[];
    links: any[];
    tags: any[];
    restrictions: any[];
    see_also: any[];
    antonyms: any[];
    source: any[];
    info: any[];
};
  
export type Japanese = {
    word: string;
    reading: string;
};
  
export type KanjiData = {
    slug: string;
    is_common: boolean;
    tags: string[];
    jlpt: string[];
    japanese: Japanese[];
    senses: Sense[];
    attribution: {
      jmdict: boolean;
      jmnedict: boolean;
      dbpedia: boolean;
    };
};
  
export type Response = {
    meta: {
        status: number;
    };
    data: KanjiData[];
};
  