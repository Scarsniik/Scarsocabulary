import { createContext } from "react";
import { ToastContextType } from "src/models/toast";

export const ToastContext = createContext<ToastContextType>({
    list: [],
    add: () => {},
    delete: (key: string) => {},
});