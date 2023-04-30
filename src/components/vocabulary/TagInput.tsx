import React, { useContext, useEffect, useMemo, useState } from 'react';
import { classNames } from 'src/utils/classNames';
import { Tag } from 'src/models/word';

import "src/styles/vocabulary/tagInput.scss";
import DropDownMenu from 'src/components/utils/DropDownMenu';
import { ApiTags, TagResult } from 'src/api/tags';
import { ToastContext } from 'src/contexts/ToastContext';
import { ToastType } from 'src/models/toast';

interface Props {
    className?: string;
    key?: string | number;
    currentTags: Tag[];
    tags?: Tag[];
    createDisabled?: boolean;
    handleSelectTag: (tag: Tag) => void;
}

export default function TagInput ({ className, currentTags, tags, createDisabled, handleSelectTag }: Props) {
    const [searchValue, setSearch] = useState<string>("");
    const [foundTags, setFoundTags] = useState<Tag[] | undefined>(tags);

    const toasts = useContext(ToastContext);

    const filteredTags = useMemo(() => foundTags && foundTags.filter((t) => !currentTags?.find((ct) => ct.name === t.name)), [currentTags, foundTags]);
    const searchedTags = useMemo(() => filteredTags && filteredTags.filter((t) => t.name.toLowerCase().includes(searchValue.toLowerCase())), [filteredTags, searchValue]);

    useEffect(() => {
        if (!tags) {
            fetchTags();
        }
    }, [tags]);

    async function fetchTags() {
        setFoundTags(await ApiTags.getTags());
    }

    async function handleAdd() {
        const result = await ApiTags.addTag(searchValue)
        if (result.status === TagResult.Done) {
            handleSelectTag(result.content as Tag);
        } else {
            toasts.add({
                title: "Erreur",
                body: `Une erreur s'est produite lors de la création du tag.`,
                type: ToastType.Error,
            })
        }
    }

    function onTagClick(e: any, tag: Tag) {
        e.preventDefault();
        e.stopPropagation();
        handleSelectTag(tag);
    }

    return (
        <DropDownMenu
            className={classNames("tagInput", className)}
            content={searchedTags ? [
                ...(!createDisabled ? [{
                    content: <button onClick={handleAdd}>+ Nouveau</button>
                }] : []),
                ...searchedTags.map((t, i) => ({
                    content: <button key={i} onClick={(e) => onTagClick(e, t)}>{t.name}</button>,
                }))
            ]: []}
            refreshTrigger={searchedTags && searchedTags.length}
        >
            <input placeholder="Ajouter un tag" type="text" onChange={(e) => setSearch(e.target.value)}/>
        </DropDownMenu>
    );
}
