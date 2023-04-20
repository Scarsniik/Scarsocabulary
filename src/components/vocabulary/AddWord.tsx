import React, { useContext, useState } from "react";
import { ApiVocabulary } from "src/api/vocabulary";
import { ToastContext } from "src/contexts/ToastContext";
import { Word } from "src/models/word";
import { classNames } from "src/utils/classNames";

import "src/styles/vocabulary/addWord.scss"
import { ToastType } from "src/models/toast";
import { PopupContext } from "src/contexts/PopupContext";

interface Props {
    onAdd: (w: Word) => void;
    defaultWord?: Word;
}

export default function AddWord(props: Props) {
    const { onAdd, defaultWord } = props;
    const [word, setWord] = useState<Word>(defaultWord || {
        name: "",
        kana: "",
        kanji: "",
    });

    const [errors, setErrors] = useState({
        name: false,
        kana: false,
        kanji: false,
    });

    const toasts = useContext(ToastContext);
    const popup = useContext(PopupContext);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWord({ ...word, [event.target.id]: event.target.value });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newErrors = errors;
        newErrors.name = word.name === "";
        newErrors.kana = word.kana === "";

        if (!newErrors.name && !newErrors.kana && !newErrors.kanji) {
            const result = defaultWord ? await ApiVocabulary.editWord(word) : await ApiVocabulary.addWord(word);
            if (result.status === ApiVocabulary.AddWordResult.Done) {
                onAdd(result.content as Word);
                toasts.add({
                    title: "Succes",
                    body: defaultWord ? `Le mot ${word.name} à été modifié.` : `Le mot ${word.name} à été ajouté à la liste.`,
                    type: ToastType.Success,
                })
                if (defaultWord) popup.close();
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
                    value={word.name}
                    onChange={handleChange}
                    placeholder="Français"
                />
                <input
                    id="kana"
                    className={classNames(errors.kana && "error")}
                    type="text"
                    value={word.kana}
                    onChange={handleChange}
                    placeholder="Kana"
                />
                <input
                    id="kanji"
                    className={classNames(errors.kanji && "error")}
                    type="text"
                    value={word.kanji}
                    onChange={handleChange}
                    placeholder="Kanji"
                />

                <button type="submit">{defaultWord ? "Modifier" : "Ajouter"}</button>
            </form>
        </div>
    );
}
