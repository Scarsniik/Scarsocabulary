import { useContext, useMemo, useState } from "react";
import { ApiVocabulary } from "src/api/vocabulary";
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

export default function VocabularyList() {
    const [selectedVocabulary, setSelectedVocabulary] = useState<Word[]>([]);
    const [vocabulary, setVocabulary] = useState<Word[]>(ApiVocabulary.getVocabulary());
    const [search, setSearch] = useState<string>("");
    const [refresh, setRefresh] = useState<number>(0);

    const popup = useContext(PopupContext);
    
    const displayedVocabulary = useMemo(() => vocabulary.filter((word) =>
        word.kana.includes(search) ||
        word.kanji.includes(search) ||
        word.name.includes(search)),
    [search, vocabulary, refresh]); // eslint-disable-line react-hooks/exhaustive-deps

    function handleDelete(word: Word) {
        // Code pour supprimer l'entrée
        console.log("Supression de ", word);
        const newVocabulary = vocabulary.filter((w) => w.name !== word.name);
        setVocabulary(newVocabulary);
        ApiVocabulary.setVocabulary(newVocabulary);
    }

    function handleSelect(word: Word) {
        if (selectedVocabulary.includes(word)) {
            setSelectedVocabulary(selectedVocabulary.filter((w) => w !== word));
        } else {
            setSelectedVocabulary([...selectedVocabulary, word]);
        }
    }

    function handleEdit(vocabulary: Word) {
        // Code pour éditer l'entrée
    }

    function handleSearch(value: string) {
        console.log("recherche", value)
        setSearch(value);
    }

    function onAdd(newVocabulary: Word[]) {
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
                <button onClick={openAddForm} className="addButton"><Svg src={AddIcon}/></button>
            </div>
            { displayedVocabulary.length > 0 ? (
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
