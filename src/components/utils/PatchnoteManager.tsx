import React, { useContext, useEffect } from "react";
import { PopupContext } from "src/contexts/PopupContext";
import { patchnote } from "src/patchnote";

import "src/styles/patchnote.scss";

const PatchnoteManager: React.FC = () => {
    const popup = useContext(PopupContext);
    
    useEffect(() => {
        const lastVarsion = localStorage.getItem("lastVersion");
        if (lastVarsion !== patchnote[0].version) {
            popup.setData({
                title: "Patch Note",
                body: <div className="patchnote">
                    { patchnote.map((note) => <div>
                        <h3>{note.version}</h3>
                        <h4>{note.date}</h4>
                        <ul>
                            { note.changes.map((change) =>
                                <li>{change}</li>
                            )}
                        </ul>
                    </div>)}
                </div>,
                onClose: () => localStorage.setItem("lastVersion", patchnote[0].version)
            })
        }
    }, [popup]);

    return <></>;
};

export default PatchnoteManager;
