import { useContext, useMemo } from "react";
import { PopupContext } from "src/contexts/PopupContext";
import { PopupData, PopupContextType } from "src/models/popup";
import { classNames } from "src/utils/classNames";

import "src/styles/popup.scss";
import OutsideAlerter from "src/components/utils/ClickOutsideAlerter";

export function Popup() {
    const popup = useContext<PopupContextType>(PopupContext);
    const content = useMemo<PopupData | null>(() => popup.data, [popup?.data]);
    const show = useMemo<boolean>(() => content !== null, [content]);

    return show ? (
        <div className={classNames("popupContainer", show && "open")}>
            <OutsideAlerter onClickOutside={popup.close}>
                <div className={classNames("popup", content?.notScrollable && "notScrollable")}>
                    <div className="popupHeader">
                    <h3>{content?.title}</h3>
                    <button className="popupClose" onClick={() => popup.close()}>X</button>
                    </div>
                    <div className="popupContent">{content?.body}</div>
                    <div className="popupActions">
                        {content?.actions?.map((action, index) => (
                            <button key={index} onClick={action.onClick}>{action.label}</button>
                        ))}
                    </div>
                </div>
            </OutsideAlerter>
        </div>
    ) : null;
}
