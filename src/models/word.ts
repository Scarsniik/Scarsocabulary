export interface Word {
    _id?: string;
    name: string;
    kana: string;
    kanji: string;
}

export interface Kanji {
    _id?: string;
    name: string;
    kanji: string;
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
  