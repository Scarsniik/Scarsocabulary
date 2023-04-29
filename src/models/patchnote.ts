import { Moment } from "moment";

export interface Patchnote {
    version: string;
    date: string;
    changes: string[];
}