import { ApiResult } from "src/models/api";
import { Kanji } from "src/models/word";
import { API_URL } from "src/config";
import axios from "src/api/axios";

export enum KanjiResult {
  Done,
  BadArguments,
  AlreadyIn,
  NotFound,
}

const KANJI_API_URL = `${API_URL}/kanjis`;

async function getKanjis(): Promise<Kanji[]> {
  try {
    const { data } = await axios.get(KANJI_API_URL);
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

async function addKanji(kanji: Kanji): Promise<ApiResult<Kanji, KanjiResult>> {
  if (kanji.kanji === "" || kanji.name === "") return {status: KanjiResult.BadArguments}

  try {        
    const result = await axios.post<any, any>(KANJI_API_URL, kanji);
    return {
      status: KanjiResult.Done,
      content: result.data,
    };
  } catch (error) {
    console.error(error);
    return {
      status: KanjiResult.BadArguments,
    };
  }
}

async function syncronise(): Promise<ApiResult<Kanji[], KanjiResult>> {
  try {        
    const result = await axios.post<any, any>(`${KANJI_API_URL}/synchronise`);
    return {
      status: KanjiResult.Done,
      content: result.data,
    };
  } catch (error) {
    console.error(error);
    return {
      status: KanjiResult.BadArguments,
    };
  }
}

async function editKanji(kanji: Kanji): Promise<ApiResult<Kanji, KanjiResult>> {
  if (kanji.kanji === "" || kanji.name === "") return {status: KanjiResult.BadArguments}

  try {        
    const result = await axios.put<any, any>(`${KANJI_API_URL}/${kanji._id}`, kanji);
    return {
      status: KanjiResult.Done,
      content: result.data,
    };
  } catch (error) {
    console.error(error);
    return {
      status: KanjiResult.BadArguments,
    };
  }
}

async function importKanjis(kanji: Kanji): Promise<ApiResult<Kanji[], KanjiResult>> {
  if (kanji.kanji === "" || kanji.name === "") return {status: KanjiResult.BadArguments}

  try {        
    await axios.post(`${KANJI_API_URL}/import`, kanji);
    return {
      status: KanjiResult.Done,
    };
  } catch (error) {
    console.error(error);
    return {
      status: KanjiResult.BadArguments,
    };
  }
}

async function removeKanji(id: string): Promise<ApiResult<Kanji[], KanjiResult>> {
  try {
    await axios.delete(`${KANJI_API_URL}/${id}`);

    return {
      status: KanjiResult.Done,
    };
  } catch (error) {
    console.error(error);
    return {
      status: KanjiResult.NotFound,
    };
  }
}

export const ApiKanji = {
  getKanjis,
  addKanji,
  removeKanji,
  AddKanjiResult: KanjiResult,
  importKanjis,
  editKanji,
  syncronise,
};
