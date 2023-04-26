import AddKanji from "src/components/kanji/AddKanji";
import { PopupData } from "src/models/popup";
import { Kanji, Word } from "src/models/word";

export function getAddKanjiPopup(onAdd: (k: Kanji) => void, kanji?: Kanji): PopupData {
    return {
        actions: [],
        body: <AddKanji onAdd={onAdd} defaultKanji={kanji}/>,
        title: "Ajouter un kanji",
    };
}