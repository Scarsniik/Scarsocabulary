import { useEffect, useState } from "react";
import { ApiVocabulary, WordResult } from "src/api/vocabulary";
import Layout from "src/components/layout/Layout";
import { Word } from "src/models/word";
import { getAddWordPopup } from "src/components/vocabulary/AddWordPopup";
import * as wanakana from "wanakana";
import TermList, { Column } from "src/components/utils/termList/TermList";

import "src/styles/vocabulary/vocabularyList.scss";


export default function VocabularyList() {
    const [vocabulary, setVocabulary] = useState<Word[] | undefined>(undefined);
    const [refresh, setRefresh] = useState<number>(0);

    useEffect(() => {
        fetchVocabulary();
      }, [refresh]);

    async function fetchVocabulary() {
        const result = await ApiVocabulary.getVocabulary();
        setVocabulary(result);
    }

    async function removeWord(word: Word): Promise<boolean> {
        if (!vocabulary) return false;
        
        if ((await ApiVocabulary.removeWord(word._id as string)).status === WordResult.Done) {
            const newVocabulary = vocabulary.filter((w) => w.name !== word.name);
            setVocabulary(newVocabulary);
            return true;
        }

        return false;
    }

    function searchFilterFunc(word: Word, search: string) {
        return (word.kana?.toLowerCase().includes(search.toLowerCase()) || wanakana.toRomaji(word.kana).includes(search.toLowerCase())) ||
            word.kanji?.toLowerCase().includes(search.toLowerCase()) ||
            word.name?.toLowerCase().includes(search.toLowerCase());
    }

    function onAdd(newWord: Word) {
        console.log(newWord);
        setVocabulary([...vocabulary as Word[], newWord]);
        setRefresh(Date.now());
    }

    function onEdit(newWord: Word) {
        const newVocabulary = vocabulary as Word[];
        const index = newVocabulary?.findIndex((w) => w._id === newWord._id);
        newVocabulary[index] = newWord;
        setVocabulary(newVocabulary);
        setRefresh(Date.now());
    }

    function getDeleteMessage(word: Word, error?: boolean): string {
        return error ? (
            `Une erreur est survenu lors de la suppression de ${word.name}.`
        ) : (
            `Le mot ${word.name} a bien été supprimé.`
        );
    }

    const column: Column<Word>[] = [
        {
            label: "Nom",
            render: (item: Word) => item.name,
        },
        {
            label: "Kana",
            render: (item: Word) => item.kana,
        },
        {
            label: "Kanji",
            render: (item: Word) => item.kanji,
        }
    ]

    return ( <Layout center>
        <TermList<Word>
            columns={column}
            extraActions={[]}
            getAddPopup={(word) => word ? getAddWordPopup(onEdit, word) : getAddWordPopup(onAdd, word)}
            getDeleteMessage={getDeleteMessage}
            items={vocabulary}
            refresh={refresh}
            removeItem={removeWord}
            searchFilterFunc={searchFilterFunc}
            onImport={() => setRefresh(Date.now)}
            title="Vocabulaire"
            sortBy="name"
        />
    </Layout>);
}
