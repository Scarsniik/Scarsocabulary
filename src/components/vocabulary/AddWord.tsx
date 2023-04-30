import React, { useContext, useMemo, useState } from "react";
import { ApiVocabulary } from "src/api/vocabulary";
import { ToastContext } from "src/contexts/ToastContext";
import { Tag, Word } from "src/models/word";
import { classNames } from "src/utils/classNames";

import "src/styles/vocabulary/addWord.scss"
import { ToastType } from "src/models/toast";
import { PopupContext } from "src/contexts/PopupContext";
import TagInput from "src/components/vocabulary/TagInput";
import TagDisplay from "src/components/vocabulary/TagDisplay";

interface Props {
    onAdd: (w: Word) => void;
    defaultWord?: Word;
    tags?: Tag[];
}

export default function AddWord(props: Props) {
    const { onAdd, defaultWord, tags } = props;
    const emptyForm = useMemo(() => defaultWord || {
        name: "",
        kana: "",
        kanji: "",
    }, [defaultWord])
    const [word, setWord] = useState<Word>(emptyForm);
    const [wordsTags, setWordsTags] = useState<Tag[]>((tags && defaultWord) ? tags.filter(t => word.tags?.includes(t._id as string)) : []);

    const [errors, setErrors] = useState({
        name: false,
        kana: false,
        kanji: false,
    });

    const toasts = useContext(ToastContext);
    const popup = useContext(PopupContext);

    function handleChange (event: React.ChangeEvent<HTMLInputElement>) {
        setWord({ ...word, [event.target.id]: event.target.value });
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const newErrors = errors;
        newErrors.name = word.name === "";
        newErrors.kana = word.kana === "";

        if (!newErrors.name && !newErrors.kana && !newErrors.kanji) {
            const newWord: Word = {
                ...word,
                tags: wordsTags.map(t => t._id as string),
            }
            const result = defaultWord ? await ApiVocabulary.editWord(newWord) : await ApiVocabulary.addWord(newWord);
            if (result.status === ApiVocabulary.AddWordResult.Done) {
                onAdd(result.content as Word);
                toasts.add({
                    title: "Succes",
                    body: defaultWord ? `Le mot ${word.name} à été modifié.` : `Le mot ${word.name} à été ajouté à la liste.`,
                    type: ToastType.Success,
                })
                if (defaultWord) popup.close();
                const form = event.target as HTMLFormElement;
                setWord(emptyForm);
                setWordsTags([]);
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

    async function handleAddTag(tag: Tag) {
        setWordsTags([...wordsTags, tag]);
    }

    async function handleRemoveTag(tag: Tag) {
        setWordsTags(wordsTags.filter(t => t._id !== tag._id));
    }

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
                <section className="tags">
                    {wordsTags?.map((t, i) => <TagDisplay key={i} tag={t as Tag} onRemove={handleRemoveTag}/>)}
                    <TagInput currentTags={wordsTags as Tag[]} tags={tags} handleSelectTag={handleAddTag}/>
                </section>

                <button className="button" type="submit">{defaultWord ? "Modifier" : "Ajouter"}</button>
            </form>
        </div>
    );
}
