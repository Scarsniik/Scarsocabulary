import { useEffect, useMemo, useState } from "react";
import { ApiKanji, KanjiResult } from "src/api/kanjis";
import Layout from "src/components/layout/Layout";
import { Kanji } from "src/models/word";
import { getAddKanjiPopup } from "src/components/kanji/AddKanjiPopup";
import TermList, { Column, Filters } from "src/components/utils/termList/TermList";
import ExtractKanjiButton from "src/components/kanji/ExtractKanjiButton";

import "src/styles/vocabulary/vocabularyList.scss";
import moment from "moment";
import Slider from "src/components/utils/Slider";


export default function VocabularyList() {
    const [kanjis, setKanjis] = useState<Kanji[] | undefined>(undefined);
    const [refresh, setRefresh] = useState<number>(0);
    const [filters, setFilters] = useState<Filters>({
        createdSince: 0,
    });
    
    useEffect(() => {
        fetch();
      }, [refresh]);

    async function fetch() {
        const result = await ApiKanji.getKanjis();
        setKanjis(result);
    }

    const displayed = useMemo(() => kanjis?.filter((w) => {
        let keep = true;
        if (
            filters.createdSince > 0 &&
            (!w.createdAt || !moment(w.createdAt).isBetween(moment().subtract(filters.createdSince, 'days'), moment(), 'day', '[]'))
        ) keep = false;
        return keep;
    }), [filters, kanjis]);

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

    function renderFilters() {
        return [
            <div className="filters">
                <label htmlFor="todayFilter">Crée depuis : </label>
                <Slider
                    id="todayFilter"
                    value={filters.createdSince}
                    onChange={(v) => setFilters({...filters, ...{createdSince: v}})}
                    formatValue={(v) => v === 0 ?
                        "Desactivé"
                        : `${v} jour${v > 1 ? "s" : ""}`}
                    min={0}
                    max={14}
                    step={1}
                />
            </div>
        ];
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

    return ( <Layout center loading={!kanjis}>
        <TermList<Kanji>
            columns={column}
            extraActions={[<ExtractKanjiButton key="extract" onFinished={() => setRefresh(Date.now())}/>]}
            getAddPopup={(kanji) => kanji ? getAddKanjiPopup(onEdit, kanji) : getAddKanjiPopup(onAdd, kanji)}
            getDeleteMessage={getDeleteMessage}
            items={displayed}
            refresh={refresh}
            removeItem={removeKanji}
            searchFilterFunc={searchFilterFunc}
            onImport={() => setRefresh(Date.now)}
            title="Kanji"
            sortBy="name"
            filters={renderFilters()}
        />
    </Layout>);
}
