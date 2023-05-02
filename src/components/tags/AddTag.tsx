import React, { useContext, useMemo, useState } from "react";
import { ApiTags } from "src/api/tags";
import { ToastContext } from "src/contexts/ToastContext";
import { Tag } from "src/models/word";
import { classNames } from "src/utils/classNames";

import "src/styles/vocabulary/addWord.scss"
import { ToastType } from "src/models/toast";
import { PopupContext } from "src/contexts/PopupContext";

interface Props {
    onAdd: (w: Tag) => void;
    defaultTag?: Tag;
}

export default function AddTag(props: Props) {
    const { onAdd, defaultTag } = props;
    const emptyForm = useMemo(() => defaultTag || {
        name: "",
        kana: "",
        kanji: "",
    }, [defaultTag])
    const [tag, setTag] = useState<Tag>(emptyForm);

    const [errors, setErrors] = useState({
        name: false,
        kana: false,
        kanji: false,
    });

    const toasts = useContext(ToastContext);
    const popup = useContext(PopupContext);

    function handleChange (event: React.ChangeEvent<HTMLInputElement>) {
        setTag({ ...tag, [event.target.id]: event.target.value });
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const newErrors = errors;
        newErrors.name = tag.name === "";

        if (!newErrors.name && !newErrors.kana && !newErrors.kanji) {
            const result = defaultTag ? await ApiTags.editTag(tag) : await ApiTags.addTag(tag.name);
            if (result.status === ApiTags.TagResult.Done) {
                onAdd(result.content as Tag);
                toasts.add({
                    title: "Succes",
                    body: defaultTag ? `Le tag ${tag.name} à été modifié.` : `Le tag ${tag.name} à été ajouté à la liste.`,
                    type: ToastType.Success,
                })
                if (defaultTag) popup.close();
                const form = event.target as HTMLFormElement;
                setTag(emptyForm);
                form.getElementsByTagName("input")[0].focus();
            } else {
                toasts.add({
                    title: "Erreur",
                    body: `Une erreur s'est produite lors de l'ajout du mot.`,
                    type: ToastType.Error,
                })
            }
        } else {
            setErrors(newErrors);
        }
    }

    return (
        <div className="addWord">
            <form onSubmit={handleSubmit}>
                <input
                    id="name"
                    className={classNames(errors.name && "error")}
                    type="text"
                    value={tag.name}
                    onChange={handleChange}
                    placeholder="Nom du tag"
                />
                <button className="button" type="submit">{defaultTag ? "Modifier" : "Ajouter"}</button>
            </form>
        </div>
    );
}
