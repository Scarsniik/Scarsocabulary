import { useContext, useEffect, useMemo, useState } from "react";
import { ApiVocabulary, WordResult } from "src/api/vocabulary";
import Layout from "src/components/layout/Layout";
import Checkbox from "src/components/utils/Checkbox";
import Svg from "src/components/utils/Svg";
import { Word } from "src/models/word";
import EditIcon from "src/assets/img/edit.svg";
import DeleteIcon from "src/assets/img/delete.svg";
import AddIcon from "src/assets/img/add.svg";
import { PopupContext } from "src/contexts/PopupContext";
import { getAddWordPopup } from "src/components/vocabulary/AddWordPopup";

import "src/styles/vocabulary/vocabularyList.scss";
import ImportButton from "src/components/vocabulary/ImportButton";
import { ToastContext } from "src/contexts/ToastContext";
import { ToastType } from "src/models/toast";
import ExportButton from "src/styles/vocabulary/ExportButton";

export default function VocabularyList() {
    const [selectedVocabulary, setSelectedVocabulary] = useState<Word[]>([]);
    const [vocabulary, setVocabulary] = useState<Word[] | undefined>(undefined);
    const [search, setSearch] = useState<string>("");
    const [refresh, setRefresh] = useState<number>(0);

    const popup = useContext(PopupContext);
    const toast = useContext(ToastContext);
    
    const displayedVocabulary = useMemo(() => {
        return vocabulary?.filter((word) =>
        word.kana?.toLowerCase().includes(search.toLowerCase()) ||
        word.kanji?.toLowerCase().includes(search.toLowerCase()) ||
        word.name?.toLowerCase().includes(search.toLowerCase())).sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            return nameA.localeCompare(nameB, "fr");
        })
    },
    [search, vocabulary, refresh]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        fetchVocabulary();
      }, []);

    async function fetchVocabulary() {
        const result = await ApiVocabulary.getVocabulary();
        setVocabulary(result);
    }

    async function handleDelete(word: Word) {
        if (!vocabulary) return;
        
        if ((await ApiVocabulary.removeWord(word.id as string)).status === WordResult.Done) {
            const newVocabulary = vocabulary.filter((w) => w.name !== word.name);
            setVocabulary(newVocabulary);
            toast.add({
                title: "Succes",
                type: ToastType.Success,
                body:`Le mot ${word.name} a bien été supprimé.`,
            })
        } else {
            toast.add({
                title: "Erreur",
                type: ToastType.Error,
                body:`Une erreur est survenu lors de la suppression de ${word.name}.`,
            })
        }
    }

    function handleSelect(word: Word) {
        if (selectedVocabulary.includes(word)) {
            setSelectedVocabulary(selectedVocabulary.filter((w) => w !== word));
        } else {
            setSelectedVocabulary([...selectedVocabulary, word]);
        }
    }

    function handleEdit(word: Word) {
        console.log(word);
        popup.setData(getAddWordPopup(onEdit, word));
    }

    function handleSearch(value: string) {
        console.log("recherche", value)
        setSearch(value);
    }

    function onAdd(newWord: Word) {
        console.log(newWord);
        setVocabulary([...vocabulary as Word[], newWord]);
        setRefresh(Date.now());
    }

    function onEdit(newWord: Word) {
        const newVocabulary = vocabulary as Word[];
        const index = newVocabulary?.findIndex((w) => w.id === newWord.id);
        newVocabulary[index] = newWord;
        setVocabulary(newVocabulary);
        setRefresh(Date.now());
    }

    function openAddForm() {
        popup.setData(getAddWordPopup(onAdd));
    }

    return (
        <Layout center>
        <div className="vocabularyList">
            <h2 className="title"> Vocabulaire </h2>
            <div className="tools">
                <div className="searchContainer">
                    <input
                        className="searchInput"
                        type="text"
                        placeholder="Chercher"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
                <div className="contentButtons">
                    { vocabulary &&
                        <ExportButton vocabulary={vocabulary as Word[]}/>
                    }
                    <ImportButton onImportSuccess={() => toast.add({title: "Succes", type: ToastType.Success, body:"Le JSON a été importé avec succes"})}/>
                    <button onClick={openAddForm} className="addButton"><Svg src={AddIcon}/></button>
                </div>
            </div>
            { displayedVocabulary && displayedVocabulary.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th/>
                            <th>Nom</th>
                            <th>Kana</th>
                            <th>Kanji</th>
                            <th/>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedVocabulary.map((word, key) => (
                        <tr key={key}>
                            <td>
                                <Checkbox
                                    onChange={() => handleSelect(word)}
                                    checked={selectedVocabulary.includes(word)}
                                />
                            </td>
                            <td>{word.name}</td>
                            <td>{word.kana}</td>
                            <td>{word.kanji}</td>
                            <td className="actionsLine">
                                <button onClick={() => handleEdit(word)}>
                                    <Svg src={EditIcon}/>
                                </button>
                                <button onClick={() => handleDelete(word)}>
                                    <Svg src={DeleteIcon}/>
                                </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            ) : <p className="noResult">Aucun résultat</p>}
        </div>
        </Layout>
    );
}
