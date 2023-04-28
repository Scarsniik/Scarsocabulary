import moment from "moment";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiVocabulary, WordResult } from "src/api/vocabulary";
import Layout from "src/components/layout/Layout";
import { getAddWordPopup } from "src/components/vocabulary/AddWordPopup";
import { PopupContext } from "src/contexts/PopupContext";
import { ToastContext } from "src/contexts/ToastContext";
import { ToastType } from "src/models/toast";
import { WordAndData } from "src/models/word";
import "src/styles/app.scss";

export default function WordDetails() {
    const [result, setResult] = useState<WordAndData>();
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

    useEffect(() => {
        if (wordId && !fetching.current) {
            fetch();
        }
    }, [wordId, fetch])

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

    function handleEdit() {
        popup.setData(getAddWordPopup(onEdit, result!.word))
    }


    return (
        <Layout center loading={!result}>
            <div className="wordDetails">
                <div>
                    <p><label>Français: </label>{result?.word?.name}</p>
                    <p><label>Kana: </label>{result?.word?.kana}</p>
                    { result?.word?.kanji &&
                        <p><label>Kanji: </label>{result?.word?.kanji}</p>
                    }
                    <p><label>Crée le </label>{moment(result?.word?.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                    <p><label>Modifié le </label>{moment(result?.word?.updatedAt).format('DD/MM/YYYY HH:mm')}</p>
                </div>
                <div>
                    <button onClick={handleEdit}>Edit</button>
                    <button onClick={removeWord}>Delete</button>
                </div>
            </div>
        </Layout>
    );
}
