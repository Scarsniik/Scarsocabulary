import { useEffect, useState } from "react";
import { ApiKanji, KanjiResult } from "src/api/kanjis";
import Layout from "src/components/layout/Layout";
import { Kanji } from "src/models/word";
import { getAddKanjiPopup } from "src/components/kanji/AddKanjiPopup";
import TermList, { Column } from "src/components/utils/termList/TermList";
import ExtractKanjiButton from "src/components/kanji/ExtractKanjiButton";

import "src/styles/vocabulary/vocabularyList.scss";


export default function VocabularyList() {
    const [kanjis, setKanjis] = useState<Kanji[] | undefined>(undefined);
    const [refresh, setRefresh] = useState<number>(0);

    useEffect(() => {
        fetch();
      }, []);

    async function fetch() {
        const result = await ApiKanji.getKanjis();
        setKanjis(result);
    }

    async function removeKanji(kanji: Kanji): Promise<boolean> {
        if (!kanjis) return false;
        
        if ((await ApiKanji.removeKanji(kanji._id as string)).status === KanjiResult.Done) {
            const newVocabulary = kanjis.filter((w) => w.name !== kanji.name);
            setKanjis(newVocabulary);
            return true;
        }

        return false;
    }

    function searchFilterFunc(kanji: Kanji, search: string) {
        return kanji.kanji?.toLowerCase().includes(search.toLowerCase()) ||
            kanji.name?.toLowerCase().includes(search.toLowerCase());
    }

    function onAdd(newKanji: Kanji) {
        console.log(newKanji);
        setKanjis([...kanjis as Kanji[], newKanji]);
        setRefresh(Date.now());
    }

    function onEdit(newKanji: Kanji) {
        const newVocabulary = kanjis as Kanji[];
        const index = newVocabulary?.findIndex((w) => w._id === newKanji._id);
        newVocabulary[index] = newKanji;
        setKanjis(newVocabulary);
        setRefresh(Date.now());
    }

    function getDeleteMessage(kanji: Kanji, error?: boolean): string {
        return error ? (
            `Une erreur est survenu lors de la suppression de ${kanji.name}.`
        ) : (
            `Le kanji ${kanji.name} a bien été supprimé.`
        );
    }

    const column: Column<Kanji>[] = [
        {
            label: "Nom",
            render: (item: Kanji) => item.name,
        },
        {
            label: "Kanji",
            render: (item: Kanji) => item.kanji,
        }
    ]

    return ( <Layout center>
        <TermList<Kanji>
            columns={column}
            extraActions={[<ExtractKanjiButton onFinished={setKanjis}/>]}
            getAddPopup={(kanji) => kanji ? getAddKanjiPopup(onEdit, kanji) : getAddKanjiPopup(onAdd, kanji)}
            getDeleteMessage={getDeleteMessage}
            items={kanjis}
            refresh={refresh}
            removeItem={removeKanji}
            searchFilterFunc={searchFilterFunc}
            onImport={() => setRefresh(Date.now)}
            title="Kanji"
            sortBy="name"
        />
    </Layout>);
}
