import { createContext } from "react";
import { PopupContextType } from "src/models/popup";

export const PopupContext = createContext<PopupContextType>({
    data: {
        type: null,
        body: null,
        title: null,
        actions: null,
    },
    setData: () => {},
    close: () => {},
});