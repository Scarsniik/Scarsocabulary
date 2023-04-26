import React, { useContext, useMemo, useState } from "react";
import { ToastContext } from "src/contexts/ToastContext";
import { Kanji } from "src/models/word";
import { classNames } from "src/utils/classNames";

import { ToastType } from "src/models/toast";
import { PopupContext } from "src/contexts/PopupContext";

import "src/styles/vocabulary/addWord.scss"
import { ApiKanji } from "src/api/kanjis";

interface Props {
    onAdd: (w: Kanji) => void;
    defaultKanji?: Kanji;
}

export default function AddKanji(props: Props) {
    const { onAdd, defaultKanji } = props;
    const emptyForm = useMemo(() => defaultKanji || {
        name: "",
        kanji: "",
    }, [defaultKanji])
    const [kanji, setKanji] = useState<Kanji>(emptyForm);

    const [errors, setErrors] = useState({
        name: false,
        kanji: false,
    });

    const toasts = useContext(ToastContext);
    const popup = useContext(PopupContext);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKanji({ ...kanji, [event.target.id]: event.target.value });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newErrors = errors;
        newErrors.name = kanji.name === "";
        newErrors.kanji = kanji.kanji === "";

        if (!newErrors.name && !newErrors.kanji && !newErrors.kanji) {
            const result = defaultKanji ? await ApiKanji.editKanji(kanji) : await ApiKanji.addKanji(kanji);
            if (result.status === ApiKanji.AddKanjiResult.Done) {
                onAdd(result.content as Kanji);
                toasts.add({
                    title: "Succes",
                    body: defaultKanji ? `Le mot ${kanji.name} à été modifié.` : `Le mot ${kanji.name} à été ajouté à la liste.`,
                    type: ToastType.Success,
                })
                if (defaultKanji) popup.close();
                const form = event.target as HTMLFormElement;
                setKanji(emptyForm);
                form.getElementsByTagName("input")[0].focus();
            } else {
                toasts.add({
                    title: "Erreur",
                    body: `Un erreur s'est produite lors de l'ajout du mot.`,
                    type: ToastType.Error,
                })
            }
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div className="addWord">
            <form onSubmit={handleSubmit}>
                <input
                    id="name"
                    className={classNames(errors.name && "error")}
                    type="text"
                    value={kanji.name}
                    onChange={handleChange}
                    placeholder="Français"
                />
                <input
                    id="kanji"
                    className={classNames(errors.kanji && "error")}
                    type="text"
                    value={kanji.kanji}
                    onChange={handleChange}
                    placeholder="Kanji"
                />

                <button type="submit">{defaultKanji ? "Modifier" : "Ajouter"}</button>
            </form>
        </div>
    );
}
