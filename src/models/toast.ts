export interface ToastContextType {
    list: Toast[];
    add: (content: Toast) => void;
    delete: (key: string) => void;
}

export enum ToastType {
    Success,
    Error,
    Neutral,
}

export interface Toast {
    type: ToastType;
    key?: string | null;
    body: JSX.Element | string | null;
    title: JSX.Element | string | null;
}
