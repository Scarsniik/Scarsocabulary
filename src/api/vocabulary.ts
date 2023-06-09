import { ApiResult } from "src/models/api";
import { Word, WordAndData } from "src/models/word";
import { API_URL } from "src/config";
import axios from "src/api/axios";

export enum WordResult {
  Done,
  BadArguments,
  AlreadyIn,
  NotFound,
}

const WORD_API_URL = `${API_URL}/words`;

async function getVocabulary(): Promise<Word[]> {
  try {
    const { data } = await axios.get(WORD_API_URL);
    if (data) {
      return data;
    } else {
      return [];
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getWord(id: string): Promise<WordAndData | null> {
  try {
    const { data } = await axios.get<WordAndData>(`${WORD_API_URL}/${id}`);
    if (data) {
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function addWord(word: Word): Promise<ApiResult<Word, WordResult>> {
  if (word.kana === "" || word.name === "") return {status: WordResult.BadArguments}

  try {        
    const result = await axios.post<any, any>(WORD_API_URL, word);
    return {
      status: WordResult.Done,
      content: result.data,
    };
  } catch (error) {
    console.error(error);
    return {
      status: WordResult.BadArguments,
    };
  }
}

async function editWord(word: Word): Promise<ApiResult<Word, WordResult>> {
  if (word.kana === "" || word.name === "") return {status: WordResult.BadArguments}

  try {        
    const result = await axios.put<any, any>(`${WORD_API_URL}/${word._id}`, word);
    return {
      status: WordResult.Done,
      content: result.data,
    };
  } catch (error) {
    console.error(error);
    return {
      status: WordResult.BadArguments,
    };
  }
}

async function importWords(word: Word): Promise<ApiResult<Word[], WordResult>> {
  if (word.kana === "" || word.name === "") return {status: WordResult.BadArguments}

  try {        
    await axios.post(`${WORD_API_URL}/import`, word);
    return {
      status: WordResult.Done,
    };
  } catch (error) {
    console.error(error);
    return {
      status: WordResult.BadArguments,
    };
  }
}

async function removeWord(id: string): Promise<ApiResult<Word[], WordResult>> {
  try {
    await axios.delete(`${WORD_API_URL}/${id}`);

    return {
      status: WordResult.Done,
    };
  } catch (error) {
    console.error(error);
    return {
      status: WordResult.NotFound,
    };
  }
}

export const ApiVocabulary = {
  getVocabulary,
  getWord,
  addWord,
  removeWord,
  AddWordResult: WordResult,
  importWords,
  editWord,
};
