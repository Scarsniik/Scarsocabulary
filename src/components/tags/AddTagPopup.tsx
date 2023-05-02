import AddTag from "src/components/tags/AddTag";
import { PopupData } from "src/models/popup";
import { Tag } from "src/models/word";

export function getAddTagPopup(onAdd: (w: Tag) => void, tag?: Tag): PopupData {
    return {
        actions: [],
        body: <AddTag onAdd={onAdd} defaultTag={tag}/>,
        title: "Ajouter un tag",
        notScrollable: true,
    };
}