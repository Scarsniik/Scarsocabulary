import { useCallback, useState } from "react";
import { PopupContext } from "src/contexts/PopupContext";
import { PopupContextType } from "src/models/popup";

interface Props {
    children: React.ReactNode;
}

// A component that manages the popup state and provides the popup context to all children components
export function PopupManager({ children }: Props) {
    const [data, setData] = useState<PopupContextType["data"]>(null);

    const close = useCallback((onClose?: {() : void} | null, ) => {
        if (onClose) {
            onClose();
        } else if (onClose !== null && data?.onClose) {
            data?.onClose();
        }
        setData(null);
    }, [data]);

    return (
        <PopupContext.Provider
            value={{
                data,
                setData,
                close,
            }
        }>
        {children}
        </PopupContext.Provider>
    );
}