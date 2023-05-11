import moment from "moment";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ApiKanji, KanjiResult } from "src/api/kanjis";
import { ApiVocabulary } from "src/api/vocabulary";
import { getAddKanjiPopup } from "src/components/kanji/AddKanjiPopup";
import Layout from "src/components/layout/Layout";
import { PopupContext } from "src/contexts/PopupContext";
import { ToastContext } from "src/contexts/ToastContext";
import { ToastType } from "src/models/toast";
import { KanjiAndData, Word } from "src/models/word";
import "src/styles/vocabulary/wordDetails.scss";

export default function KanjiDetails() {
    const [result, setResult] = useState<KanjiAndData>();
    const [vocabulary, setVocabulary] = useState<Word[]>();

    const wordId = useParams().id;
    const fetching = useRef(false);

    const toast = useContext(ToastContext);
    const popup = useContext(PopupContext);
    const nav = useNavigate();

    const linkedWords = useMemo(() => vocabulary?.filter(w => result?.kanji && w.kanji?.includes(result?.kanji.kanji)), [vocabulary, result])

    const fetch = useCallback(async () => {
        fetching.current = true;
        const fetchResult = await ApiKanji.getKanji(wordId as string) as KanjiAndData;
        if (!fetchResult) {
            toast.add({
                title: "Error",
                body: `Le mot demandé est introuvable.`,
                type: ToastType.Error,
            });
            nav("/kanji");
            return;
        }
        setResult(fetchResult);
    }, [wordId, nav, toast]);

    const fetchVocabulary = useCallback(async () => {
        const fetchResult = await ApiVocabulary.getVocabulary();
        setVocabulary(fetchResult);
    }, []);

    useEffect(() => {
        if (wordId && !fetching.current) {
            fetch();
            fetchVocabulary();
        }
    }, [wordId, fetch, fetchVocabulary])

    function onEdit() {
        fetch();
    }

    async function removeWord(): Promise<boolean> {        
        if (!!result && (await ApiKanji.removeKanji(result.kanji._id as string)).status === KanjiResult.Done) {
            toast.add({
                title: "Succes",
                body: `Le kanji ${result!.kanji.name} a bien été supprimé.`,
                type: ToastType.Success,
            });
            nav("/vocabulary");
        } else {
            toast.add({
                title: "Error",
                body: `Une erreur est survenu lors de la suppression de ${result!.kanji.name}.`,
                type: ToastType.Error,
            });
        }

        return false;
    }

    function handleEdit() {
        popup.setData(getAddKanjiPopup(onEdit, result!.kanji));
    }

    console.log(result);

    return (
        <Layout center loading={!result}>
            <div className="wordDetails">
                <h2>{result?.kanji?.name}</h2>
                <section className="word">
                    <p className="japanese">{result?.kanji?.kanji}</p>
                    { result?.kanji?.createdAt &&
                        <p><label>Crée le </label>{moment(result?.kanji?.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                    }
                    { result?.kanji?.updatedAt &&
                        <p><label>Modifié le </label>{moment(result?.kanji?.updatedAt).format('DD/MM/YYYY HH:mm')}</p>
                    }
                    <button className="button" onClick={handleEdit}>Edit</button>
                    <button className="button" onClick={removeWord}>Delete</button>
                </section>
                { linkedWords &&
                    <section>
                        <h3>Vos mot utilisant ce kanji</h3>
                        <ul>
                            {linkedWords?.map((w) => <li><Link to={`/vocabulary/${w._id}`}>
                                {w.name} / {w.kana} / {w.kanji}
                            </Link></li>)}
                        </ul>
                    </section>
                }
                { result?.data.found && <section>
                    <h3>Resultat Jisho.org</h3>
                    <div className="data">
                        <p>Radical: {result!.data.radical.symbol} = {result!.data.radical.meaning}</p>
                    </div>
                </section>}
            </div>
        </Layout>
    );
}
