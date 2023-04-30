import AddWord from "src/components/vocabulary/AddWord";
import { PopupData } from "src/models/popup";
import { Tag, Word } from "src/models/word";

export function getAddWordPopup(onAdd: (w: Word) => void, word?: Word, tags?: Tag[]): PopupData {
    return {
        actions: [],
        body: <AddWord onAdd={onAdd} defaultWord={word} tags={tags}/>,
        title: "Ajouter un mot",
        notScrollable: true,
    };
}