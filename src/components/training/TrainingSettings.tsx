import { ChangeEvent, FormEvent, Fragment, useEffect, useMemo, useState } from "react";
import { ApiTags } from "src/api/tags";
import Checkbox from "src/components/utils/Checkbox";
import Slider from "src/components/utils/Slider";
import TagDisplay from "src/components/vocabulary/TagDisplay";
import TagInput from "src/components/vocabulary/TagInput";
import { TrainingFilters, TrainingLanguage, TrainingRandomType, TrainingSettingsData, TrainingSubject, TrainingType } from "src/models/training";
import { Tag } from "src/models/word";

import "src/styles/training/trainingSettings.scss";

const languageToString = {
    [TrainingLanguage.FromFrench]: "Depuis le français",
    [TrainingLanguage.FromKana]: "Kana vers français",
    [TrainingLanguage.FromKanji]: "Kanji vers français",
}

const filtersToString = {
    [TrainingFilters.Favorites]: "Favoris",
}

const randomTypeToString = {
    [TrainingRandomType.Full]: "Aléatoire",
    [TrainingRandomType.NoDouble]: "Aléatoire sans remise",
    [TrainingRandomType.Weighted]: "Aléatoire avec poids",
}

const settingsKey = "trainingSettings";

interface Props {
    onSettingsChanges: (settings: TrainingSettingsData) => void;
    onStart: () => void;
    count: number;
}

export default function TrainingSettings({onSettingsChanges, count, onStart}: Props) {
    const savedSettings = useMemo(() => {
        const stringSettings = localStorage.getItem(settingsKey);
        return stringSettings ? JSON.parse(stringSettings) : undefined;
    }, []);
    const [values, setValues] = useState<TrainingSettingsData>(
        {...{
            [TrainingSubject.Kanji]: false,
            [TrainingSubject.Vocabulary]: true,
            [TrainingType.Cards]: true,
            [TrainingLanguage.FromFrench]: true,
            [TrainingLanguage.FromKana]: false,
            [TrainingLanguage.FromKanji]: false,
            [TrainingFilters.Favorites]: false,
            createdSince: 0,
            randomType: TrainingRandomType.Full,
            tags: [],
            useScore: false,
        }, ...(savedSettings ?? {})}
    )
    const [tags, setTags] = useState<Tag[] | undefined>();

    useEffect(() => {
        if (!tags) {
            fetchTags();
        }
    }, [tags]);

    useEffect(() => {
        localStorage.setItem(settingsKey, JSON.stringify(values));
        onSettingsChanges(values);
    }, [values])

    async function fetchTags() {
        setTags(await ApiTags.getTags());
    }

    function handleChange (event: ChangeEvent<HTMLInputElement>) {
        const { name, value, type, checked } = event.target;
        let processedValue: any = value;
        if (type === "checkbox") processedValue = checked;
        if (type === "range") processedValue = parseInt(processedValue);
        const newValues = { ...values, [name]: processedValue };
        setValues(newValues);
    }

    async function handleAddTag(tag: Tag) {
        setValues({...values, tags: [...values.tags, tag._id as string]});
    }

    async function handleRemoveTag(tag: Tag) {
        setValues({...values, tags: values.tags.filter(t => t !== tag._id)});
    }

    function start(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onStart();
    }
    const currentTags = tags && values.tags?.map(t => tags.find(ct => ct._id === t) as Tag);
    return currentTags ? (
        <div className="trainingSettings">
            <h3>Settings</h3>
            <form onSubmit={start}>
                <section className="subject">
                    <p className="sectionTitle">Sections sur lesquels vous entrainer :</p>
                    { Object.entries(TrainingSubject).map(([subjectKey, subjectValue], key) => <Fragment key={key}>
                        <label key={`label-${key}`} htmlFor={subjectKey}>{subjectKey} : </label>
                        <Checkbox
                            key={key}
                            name={subjectValue}
                            id={subjectKey}
                            checked={(values[subjectValue])}
                            onChange={handleChange}
                        />
                    </Fragment>)}
                </section>
                <section className="subject">
                    <p className="sectionTitle">Type d'exercice :</p>
                    { Object.entries(TrainingType).map(([typeKey, typeValue], key) => <Fragment key={key}>
                        <label key={`label-${key}`} htmlFor={typeKey}>{typeKey} : </label>
                        <Checkbox
                            key={key}
                            name={typeValue}
                            id={typeKey}
                            checked={(values[typeValue])}
                            onChange={handleChange}
                        />
                    </Fragment>)}
                </section>
                <section className="subject">
                    <p className="sectionTitle">Options de langue :</p>
                    { Object.entries(TrainingLanguage).map(([languageKey, languageValue], key) => <Fragment key={key}>
                        <label key={`label-${key}`} htmlFor={languageKey}>{languageToString[languageValue]} : </label>
                        <Checkbox
                            key={key}
                            name={languageValue}
                            id={languageKey}
                            checked={(values[languageValue])}
                            onChange={handleChange}
                        />
                    </Fragment>)}
                </section>
                <section className="subject">
                    <p className="sectionTitle">Type de tirage :</p>
                    { Object.entries(TrainingRandomType).map(([randomTypeKey, randomTypeValue], key) => <Fragment key={key}>
                        <label key={`label-${key}`} htmlFor={randomTypeKey}>{randomTypeToString[randomTypeValue]} : </label>
                        <Checkbox
                            key={key}
                            name="randomType"
                            id={randomTypeKey}
                            value={randomTypeValue}
                            checked={(values.randomType === randomTypeValue)}
                            onChange={handleChange}
                            radio
                        />
                    </Fragment>)}
                </section>
                <section className="subject">
                    <p className="sectionTitle">Filtres de contenu (facultatif):</p>
                    { Object.entries(TrainingFilters).map(([filterKey, filterValue], key) => <Fragment key={key}>
                        <label key={`label-${key}`} htmlFor={filterKey}>{filtersToString[filterValue]} : </label>
                        <Checkbox
                            key={key}
                            name={filterValue}
                            id={filterKey}
                            checked={(values[filterValue])}
                            onChange={handleChange}
                        />
                    </Fragment>)}
                    <label>Créé depuis : </label>
                    <Slider
                        id="todayFilter"
                        value={values.createdSince}
                        name="createdSince"
                        onChange={(__, e) => handleChange(e)}
                        formatValue={(v) => v === 0 ?
                            "Desactivé"
                            : `${v} jour${v > 1 ? "s" : ""}`}
                    />
                    <div className="tags">
                        {currentTags?.map((t, i) => <TagDisplay key={i} tag={t} onRemove={handleRemoveTag}/>)}
                        <TagInput
                            currentTags={currentTags}
                            tags={tags}
                            createDisabled
                            handleSelectTag={handleAddTag}
                        />
                    </div>
                </section>
                <button className="button" type="submit">Commencer avec {count} données</button>
            </form>
        </div>
    ) : <></>;
}
