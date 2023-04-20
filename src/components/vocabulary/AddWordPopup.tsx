import AddWord from "src/components/vocabulary/AddWord";
import { PopupData } from "src/models/popup";
import { Word } from "src/models/word";

export function getAddWordPopup(onAdd: (w: Word) => void, word?: Word): PopupData {
    return {
        actions: [],
        body: <AddWord onAdd={onAdd} defaultWord={word}/>,
        title: "Ajouter un mot",
    };
}