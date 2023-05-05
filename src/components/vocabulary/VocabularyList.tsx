import { useEffect, useMemo, useState } from "react";
import { ApiVocabulary, WordResult } from "src/api/vocabulary";
import Layout from "src/components/layout/Layout";
import { Tag, Word } from "src/models/word";
import { getAddWordPopup } from "src/components/vocabulary/AddWordPopup";
import * as wanakana from "wanakana";
import TermList, { Column, Filters } from "src/components/utils/termList/TermList";

import "src/styles/vocabulary/vocabularyList.scss";
import { Link } from "react-router-dom";
import moment from "moment";
import { ApiTags } from "src/api/tags";
import Slider from "src/components/utils/Slider";
import TagDisplay from "src/components/vocabulary/TagDisplay";
import TagInput from "src/components/vocabulary/TagInput";

export default function VocabularyList() {
    const [vocabulary, setVocabulary] = useState<Word[] | undefined>(undefined);
    const [refresh, setRefresh] = useState<number>(0);
    const [tags, setTags] = useState<Tag[] | undefined>();
    const [tagsForFilter, setTagsForFilter] = useState<Tag[]>([]);
    const [filters, setFilters] = useState<Filters>({
        createdSince: 0,
    });

    const displayed = useMemo(() => vocabulary?.filter((w) => {
        let keep = true;
        if (
            filters.createdSince > 0 &&
            (!w.createdAt || !moment(w.createdAt).isBetween(moment().subtract(filters.createdSince, 'days'), moment(), 'day', '[]'))
        ) keep = false;
        const hadTags = w.tags && w.tags.length > 0;
        if ((hadTags && tagsForFilter.length > 0 && !tagsForFilter.some(t => (w.tags as string[]).includes(t._id as string))) || (!hadTags && tagsForFilter.length > 0)) {
            keep = false
        }
        return keep;
    }), [filters, vocabulary, tagsForFilter]);

    useEffect(() => {
        fetchVocabulary();
        fetchTags();
    }, [refresh]);

    useEffect(() => {
        if (!tags) {
            fetchTags();
        }
    }, [tags]);

    async function fetchTags() {
        setTags(await ApiTags.getTags());
    }

    async function fetchVocabulary() {
        const result = await ApiVocabulary.getVocabulary();
        setVocabulary(result);
    }

    async function removeWord(word: Word): Promise<boolean> {
        if (!vocabulary) return false;
        
        if ((await ApiVocabulary.removeWord(word._id as string)).status === WordResult.Done) {
            const newVocabulary = vocabulary.filter((w) => w.name !== word.name);
            setVocabulary(newVocabulary);
            fetchVocabulary();
            return true;
        }

        return false;
    }

    function searchFilterFunc(word: Word, search: string) {
        return ((word.kana?.toLowerCase().includes(search.toLowerCase()) || wanakana.toRomaji(word.kana).includes(search.toLowerCase())) ||
            word.kanji?.toLowerCase().includes(search.toLowerCase()) ||
            word.name?.toLowerCase().includes(search.toLowerCase()));
    }

    function onAdd(newWord: Word) {
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

    async function handleAddTag(tag: Tag) {
        setTagsForFilter([...tagsForFilter, tag]);
    }

    async function handleRemoveTag(tag: Tag) {
        setTagsForFilter(tagsForFilter.filter(t => t._id !== tag._id));
    }

    function renderFilters() {
        return [
            <div className="filters">
                <label htmlFor="todayFilter">Crée depuis :</label>
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
                {tagsForFilter?.map((t, i) => <TagDisplay key={i} tag={t as Tag} onRemove={handleRemoveTag}/>)}
                <TagInput currentTags={tagsForFilter as Tag[]} tags={tags} createDisabled handleSelectTag={handleAddTag}/>
            </div>
        ];
    }

    const column: Column<Word>[] = [
        {
            label: "Nom",
            render: (item: Word) => (
                <Link to={`/vocabulary/${item._id}`}>{item.name}</Link>
            ),
        },
        {
            label: "Kana",
            render: (item: Word) => item.kana,
        },
        {
            label: "Kanji",
            render: (item: Word) => item.kanji,
        },
        {
            label: "Tag",
            render: (item: Word) => item.tags ? item.tags.length : 0,
            className: "tagColumn",
        }
    ]

    return ( <Layout center loading={!vocabulary}>
        <TermList<Word>
            columns={column}
            extraActions={[]}
            getAddPopup={(word) => word ?  getAddWordPopup(onEdit, word, tags) : getAddWordPopup(onAdd, word, tags)}
            getDeleteMessage={getDeleteMessage}
            items={displayed}
            refresh={refresh}
            removeItem={removeWord}
            searchFilterFunc={searchFilterFunc}
            onImport={() => setRefresh(Date.now)}
            title="Vocabulaire"
            sortBy="name"
            filters={renderFilters()}
        />
    </Layout>);
}
