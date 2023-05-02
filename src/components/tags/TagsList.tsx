import { useEffect, useState } from "react";
import { ApiVocabulary} from "src/api/vocabulary";
import Layout from "src/components/layout/Layout";
import { Tag, Word } from "src/models/word";
import { getAddTagPopup } from "src/components/tags/AddTagPopup";
import TermList, { Column } from "src/components/utils/termList/TermList";
import { Link } from "react-router-dom";
import { ApiTags, TagResult } from "src/api/tags";

import "src/styles/vocabulary/vocabularyList.scss";

export default function VocabularyList() {
    const [vocabulary, setVocabulary] = useState<Word[] | undefined>(undefined);
    const [refresh, setRefresh] = useState<number>(0);
    const [tags, setTags] = useState<Tag[] | undefined>();

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

    async function removeTag(tag: Tag): Promise<boolean> {
        if (!tags) return false;
        
        if ((await ApiTags.removeTag(tag._id as string)).status === TagResult.Done) {
            const newTags = tags.filter((w) => w.name !== tag.name);
            setTags(newTags);
            fetchTags();
            return true;
        }

        return false;
    }

    function searchFilterFunc(tag: Tag, search: string) {
        return (tag.name?.toLowerCase().includes(search.toLowerCase()));
    }

    function onAdd(newTag: Tag) {
        setTags([...tags as Tag[], newTag]);
        setRefresh(Date.now());
    }

    function onEdit(newTag: Tag) {
        const newTags = tags as Tag[];
        const index = newTags?.findIndex((w) => w._id === newTag._id);
        newTags[index] = newTag;
        setTags(newTags);
        setRefresh(Date.now());
    }

    function getDeleteMessage(tag: Tag, error?: boolean): string {
        return error ? (
            `Une erreur est survenu lors de la suppression de ${tag.name}.`
        ) : (
            `Le mot ${tag.name} a bien été supprimé.`
        );
    }

    const column: Column<Tag>[] = [
        {
            label: "Nom",
            render: (item) => (
                <Link to={`/vocabulary/${item._id}`}>{item.name}</Link>
            ),
        },
        {
            label: "Mots",
            render: (item) => {
                if (vocabulary) {
                    const tags = vocabulary?.filter(w => w.tags?.includes(item._id as string))
                    return tags.length;
                }
                return 0;
            },
        },
    ]

    return ( <Layout center loading={!vocabulary && !tags}>
        <TermList<Tag>
            columns={column}
            extraActions={[]}
            getAddPopup={(tag) => tag ?  getAddTagPopup(onEdit, tag as any as Word) : getAddTagPopup(onAdd, tag)}
            getDeleteMessage={getDeleteMessage}
            items={tags}
            disableImport
            refresh={refresh}
            removeItem={removeTag}
            searchFilterFunc={searchFilterFunc}
            onImport={() => setRefresh(Date.now)}
            title="Tags"
            sortBy="name"
            counterLabel="tags"
        />
    </Layout>);
}
