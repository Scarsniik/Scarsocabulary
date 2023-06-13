import moment from "moment";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiTags } from "src/api/tags";
import { ApiVocabulary, WordResult } from "src/api/vocabulary";
import Layout from "src/components/layout/Layout";
import { getAddWordPopup } from "src/components/vocabulary/AddWordPopup";
import TagDisplay from "src/components/vocabulary/TagDisplay";
import TagInput from "src/components/vocabulary/TagInput";
import { PopupContext } from "src/contexts/PopupContext";
import { ToastContext } from "src/contexts/ToastContext";
import { ToastType } from "src/models/toast";
import { Tag, WordAndData } from "src/models/word";
import { ttsJp } from "src/utils/tts";

import "src/styles/vocabulary/wordDetails.scss";

export default function WordDetails() {
    const [result, setResult] = useState<WordAndData>();
    const [tags, setTags] = useState<Tag[] | undefined>();

    const wordId = useParams().id;
    const fetching = useRef(false);

    const toast = useContext(ToastContext);
    const popup = useContext(PopupContext);
    const nav = useNavigate();

    const fetch = useCallback(async () => {
        fetching.current = true;
        const fetchResult = await ApiVocabulary.getWord(wordId as string) as WordAndData;
        if (!fetchResult) {
            toast.add({
                title: "Error",
                body: `Le mot demandé est introuvable.`,
                type: ToastType.Error,
            });
            nav("/vocabulary");
            return;
        }
        setResult(fetchResult);
    }, [wordId, nav, toast]);
    const wordsTags = useMemo(() => tags && result && result.word.tags?.map((t) => tags.find(ft => ft._id === t)),[tags, result])

    useEffect(() => {
        if (wordId && !fetching.current) {
            fetch();
        }
    }, [wordId, fetch])

    useEffect(() => {
        if (!tags) {
            fetchTags();
        }
    }, [tags]);

    function onEdit() {
        fetch();
    }

    async function removeWord(): Promise<boolean> {        
        if (!!result && (await ApiVocabulary.removeWord(result.word._id as string)).status === WordResult.Done) {
            toast.add({
                title: "Succes",
                body: `Le mot ${result!.word.name} a bien été supprimé.`,
                type: ToastType.Success,
            });
            nav("/vocabulary");
        } else {
            toast.add({
                title: "Error",
                body: `Une erreur est survenu lors de la suppression de ${result!.word.name}.`,
                type: ToastType.Error,
            });
        }

        return false;
    }

    async function fetchTags() {
        setTags(await ApiTags.getTags());
    }

    function handleEdit() {
        popup.setData(getAddWordPopup(onEdit, result!.word, tags))
    }

    async function handleAddTag(tag: Tag) {
        if (result?.word) {
            const response = await ApiVocabulary.editWord({
                ...result?.word,
                tags: [
                    ...(result.word.tags ?? []),
                    tag._id as string,
                ],
            });
            if (response.status !== WordResult.Done) {
                toast.add({
                    title: "Error",
                    body: `Une erreur est survenu lors de la slection du tag ${tag.name}.`,
                    type: ToastType.Error,
                });
            } else {
                fetchTags();
                fetch();
            }
        }
    }

    async function handleRemoveTag(tag: Tag) {
        if (result?.word) {
            const response = await ApiVocabulary.editWord({
                ...result?.word,
                tags: (result.word.tags ?? []).filter(t => t !== tag._id),
            });
            if (response.status !== WordResult.Done) {
                toast.add({
                    title: "Error",
                    body: `Une erreur est survenu lors de la slection du tag ${tag.name}.`,
                    type: ToastType.Error,
                });
            } else {
                fetch();
            }
        }
    }

    return (
        <Layout center loading={!result || !tags}>
            <div className="wordDetails">
                <h2>{result?.word?.name}</h2>
                <section className="word">
                    <p className="japanese">{result?.word?.kana}</p>
                    { result?.word?.kanji &&
                        <p className="japanese">{result?.word?.kanji}</p>
                    }
                    { result?.word?.createdAt &&
                        <p><label>Crée le </label>{moment(result?.word?.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                    }
                    { result?.word?.updatedAt &&
                        <p><label>Modifié le </label>{moment(result?.word?.updatedAt).format('DD/MM/YYYY HH:mm')}</p>
                    }
                </section>
                    <section className="tags">
                        <h3>Tags</h3>
                        {wordsTags?.map((t, i) => <TagDisplay key={i} tag={t as Tag} onRemove={handleRemoveTag}/>)}
                        <TagInput currentTags={wordsTags as Tag[]} handleSelectTag={handleAddTag}/>
                    </section>
                <section>
                    <button className="button" onClick={() => ttsJp(result?.word.kana as string)}>Speak</button>
                    <button className="button" onClick={handleEdit}>Edit</button>
                    <button className="button" onClick={removeWord}>Delete</button>
                </section>
                { result?.data.meta.status === 200 && <section>
                    <h3>Resultat Jisho.org</h3>
                    <div className="data">
                        { result!.data.data.map((item) => 
                            item.senses.map((sense, i) => (
                                <div key={i} className="card">
                                    <h4>{item.slug} /{item.japanese.map((jap, k) => 
                                        ` ${jap.reading}${k !== item.japanese.length - 1 ? "/" : ""}`
                                    )}</h4>
                                    <p>{sense.info}</p>
                                    { sense.english_definitions.map((def, j) =>
                                        <p key={j}>{j} : {def}</p>
                                    )}
                                </div>
                            )
                        ))}
                    </div>
                </section>}
            </div>
        </Layout>
    );
}
