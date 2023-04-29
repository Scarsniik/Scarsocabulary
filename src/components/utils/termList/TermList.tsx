import { useContext, useMemo, useState } from "react";
import Checkbox from "src/components/utils/Checkbox";
import Svg from "src/components/utils/Svg";
import EditIcon from "src/assets/img/edit.svg";
import DeleteIcon from "src/assets/img/delete.svg";
import AddIcon from "src/assets/img/add.svg";
import { PopupContext } from "src/contexts/PopupContext";
import ImportButton from "src/components/vocabulary/ImportButton";
import { ToastContext } from "src/contexts/ToastContext";
import { ToastType } from "src/models/toast";
import { PopupData } from "src/models/popup";

import ExportButton from "src/components/utils/termList/ExportButton";
import DropDownMenu from "src/components/utils/DropDownMenu";

import "src/styles/vocabulary/vocabularyList.scss";

export interface Column<T> {
    label: string;
    render: (item: T) => JSX.Element | string;
}

export interface Filters {
    today: boolean;
}

interface Props<T> {
    items: T[] | undefined;
    refresh: number;
    title: string;
    columns: Column<T>[];
    extraActions?: JSX.Element[];
    sortBy: string;
    filters?: Filters;
    searchFilterFunc: (item: T, search: string) => boolean;
    removeItem: (item: T) => Promise<boolean> | boolean;
    getDeleteMessage: (item: T, error?: boolean) => string
    getAddPopup: (item?: T) => PopupData;
    onImport: () => void;
    onFilterChange?: (filters: Filters) => void;
}

export default function TermList<T>(props: Props<T>) {
    const {
        title,
        items,
        refresh,
        columns,
        extraActions,
        sortBy,
        searchFilterFunc,
        removeItem,
        getDeleteMessage,
        getAddPopup,
        onImport,
        onFilterChange,
        filters,
    } = props;
    const [selectedItems, setSelectedItems] = useState<T[]>([]);
    const [search, setSearch] = useState<string>("");

    const popup = useContext(PopupContext);
    const toast = useContext(ToastContext);
    
    const displayedItems = useMemo(() => items?.filter((item) => searchFilterFunc(item, search)).sort((a, b) => {
        const nameA = (a as any)[sortBy].toLowerCase();
        const nameB = (b as any)[sortBy].toLowerCase();
        return nameA.localeCompare(nameB, "fr");
    }),
    [search, items, refresh]); // eslint-disable-line react-hooks/exhaustive-deps

    async function handleDelete(item: T) {
        if (!items) return;
        
        if (await removeItem(item)) {
            toast.add({
                title: "Succes",
                type: ToastType.Success,
                body: getDeleteMessage(item),
            })
        } else {
            toast.add({
                title: "Erreur",
                type: ToastType.Error,
                body: getDeleteMessage(item, true),
            })
        }
    }

    function handleSelect(item: T) {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter((w) => w !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    }

    function handleEdit(item: T) {
        popup.setData(getAddPopup(item));
    }

    function handleSearch(value: string) {
        setSearch(value);
    }

    function openAddForm() {
        popup.setData(getAddPopup());
    }

    function onImportSuccess() {
        onImport();
        toast.add({title: "Succes", type: ToastType.Success, body:"Le JSON a été importé avec succes"})
    }

    return (
        <div className="vocabularyList">
            <h2 className="title"> {title} </h2>
            <div className="tools">
                { filters && onFilterChange &&
                    <DropDownMenu
                        content={[{
                            content: (
                                <div>
                                    <label htmlFor="todayFilter">Créé aujourd'hui</label>
                                    <Checkbox
                                        id="todayFilter"
                                        checked={filters.today}
                                        onChange={() => onFilterChange({...filters, ...{today: !filters.today}})}
                                    />
                                </div>
                            )
                        }]}
                        className="filters"
                    >
                        Filtres
                    </DropDownMenu>
                }
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
                    { items && <>
                        {extraActions}
                        <ExportButton<T> items={items as T[]}/>
                    </>}
                    <ImportButton onImportSuccess={onImportSuccess}/>
                    <button onClick={openAddForm} className="addButton"><Svg src={AddIcon}/></button>
                </div>
            </div>
            <p className="resultCount"> {displayedItems && displayedItems?.length > 0 && `${displayedItems?.length} mots`} </p>
            { displayedItems && displayedItems.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th/>
                                { columns.map((column, key) =>
                                    <td key={key}>{column.label}</td>
                                )}
                            <th/>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedItems.map((item, key) => (
                        <tr key={key}>
                            <td>
                                <Checkbox
                                    onChange={() => handleSelect(item)}
                                    checked={selectedItems.includes(item)}
                                />
                            </td>
                            { columns.map((column, key) =>
                                <td key={key}>{column.render(item)}</td>
                            )}
                            <td className="actionsLine">
                                <button onClick={() => handleEdit(item)}>
                                    <Svg src={EditIcon}/>
                                </button>
                                <button onClick={() => handleDelete(item)}>
                                    <Svg src={DeleteIcon}/>
                                </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            ) : <p className="noResult">Aucun résultat</p>}
        </div>
    );
}
