export interface PopupContextType {
    data: PopupData | null;
    setData: (content: PopupData) => void;
    close: (onClose?: { () : void } | null) => void;
}

export interface PopupAction {
    label: string;
    onClick: () => void;
}

export interface PopupData {
    type?: string | null;
    key?: string | null;
    body: JSX.Element | string | null;
    title: JSX.Element | string | null;
    actions?: PopupAction[] | null;
    onClose?: () => void;
    notScrollable?: boolean;
}
