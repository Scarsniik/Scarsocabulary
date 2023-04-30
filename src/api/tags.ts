import { ApiResult } from "src/models/api";
import { Tag } from "src/models/word";
import { API_URL } from "src/config";
import axios from "src/api/axios";

export enum TagResult {
  Done,
  BadArguments,
  AlreadyIn,
  NotFound,
}

const TAG_API_URL = `${API_URL}/tags`;

async function getTags(): Promise<Tag[]> {
  try {
    const { data } = await axios.get(TAG_API_URL);
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

async function getTag(id: string): Promise<Tag | null> {
  try {
    const { data } = await axios.get<Tag>(`${TAG_API_URL}/${id}`);
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

async function addTag(name: string): Promise<ApiResult<Tag, TagResult>> {
  if (name === "") return {status: TagResult.BadArguments}

  const tag = {
    name,
  };

  try {        
    const result = await axios.post<any, any>(TAG_API_URL, tag);
    return {
      status: TagResult.Done,
      content: result.data,
    };
  } catch (error) {
    console.error(error);
    return {
      status: TagResult.BadArguments,
    };
  }
}

async function editTag(tag: Tag): Promise<ApiResult<Tag, TagResult>> {
  if (tag.name === "") return {status: TagResult.BadArguments}

  try {        
    const result = await axios.put<any, any>(`${TAG_API_URL}/${tag._id}`, tag);
    return {
      status: TagResult.Done,
      content: result.data,
    };
  } catch (error) {
    console.error(error);
    return {
      status: TagResult.BadArguments,
    };
  }
}

async function removeTag(id: string): Promise<ApiResult<Tag[], TagResult>> {
  try {
    await axios.delete(`${TAG_API_URL}/${id}`);

    return {
      status: TagResult.Done,
    };
  } catch (error) {
    console.error(error);
    return {
      status: TagResult.NotFound,
    };
  }
}

export const ApiTags = {
  getTags,
  getTag,
  addTag,
  removeTag,
  TagResult,
  editTag,
};
