import { v4 as uuidv4 } from 'uuid';
import { useCallback, useState } from "react";
import ToastElement from "src/components/utils/Toast";
import { ToastContext } from "src/contexts/ToastContext";
import { Toast } from "src/models/toast";

import "src/styles/toastManager.scss";

interface Props {
    children: React.ReactNode;
}

// A component that manages the popup state and provides the popup context to all children components
export function ToastManager({ children }: Props) {
    const [list, setList] = useState<Toast[]>([]);

    const add = useCallback((toast: Toast) => {
        toast.key = uuidv4();
        setList([...list, toast]);
    }, [list]);

    const deleteToast = useCallback((key: string) => {
        setList(list.filter((item) => item.key !== key));
    }, [list]);

    return (
        <ToastContext.Provider
            value={{
                list,
                add,
                delete: deleteToast,
            }
        }>
        <div id="toastContainer">
            { list.map((toast) => 
                <ToastElement key={toast.key} toast={toast} />
            )}
        </div>
        {children}
        </ToastContext.Provider>
    );
}