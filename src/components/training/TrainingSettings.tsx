import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { ApiTags } from "src/api/tags";
import Checkbox from "src/components/utils/Checkbox";
import Slider from "src/components/utils/Slider";
import TagDisplay from "src/components/vocabulary/TagDisplay";
import TagInput from "src/components/vocabulary/TagInput";
import { TrainingFilters, TrainingLanguage, TrainingRandomType, TrainingSettingsData, TrainingSubject, TrainingType } from "src/models/training";
import { Kanji, Tag, Word } from "src/models/word";

import "src/styles/training/trainingSettings.scss";
import { testRandomElementWithScore } from "src/utils/words";

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
    [TrainingRandomType.Limited]: "Aléatoire avec limite",
}

const settingsKey = "trainingSettings";

interface Props {
    onSettingsChanges: (settings: TrainingSettingsData) => void;
    onStart: () => void;
    list: (Kanji | Word)[];
}

export default function TrainingSettings({onSettingsChanges, list, onStart}: Props) {
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
            randomWeight: 10,
            auto: false,
            timeBeforeAnswer: 5,
            timeBetweenWord: 4,
            limitedLength: 20,
            limitedRepetitionNumber: 0,
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
    }, [values, onSettingsChanges])

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

    function onRandomTest(e: any) {
        e.preventDefault();
        window.alert(testRandomElementWithScore(list, values.randomWeight / 10, 10000));
    }

    const currentTags = tags && values.tags?.map(t => tags.find(ct => ct._id === t) as Tag);
    return currentTags ? (
        <div className="trainingSettings">
            <h3 className="subTitle">Settings</h3>
            <form onSubmit={start}>
                <section className="subject">
                    <p className="sectionTitle">Sections sur lesquels vous entrainer :</p>
                    { Object.entries(TrainingSubject).map(([subjectKey, subjectValue], key) => <div key={key}>
                        <label key={`label-${key}`} htmlFor={subjectKey}>{subjectKey} : </label>
                        <Checkbox
                            key={key}
                            name={subjectValue}
                            id={subjectKey}
                            checked={(values[subjectValue])}
                            onChange={handleChange}
                        />
                    </div>)}
                </section>
                <section className="subject">
                    <p className="sectionTitle">Type d'exercice :</p>
                    { Object.entries(TrainingType).map(([typeKey, typeValue], key) => <div key={key}>
                        <label key={`label-${key}`} htmlFor={typeKey}>{typeKey} : </label>
                        <Checkbox
                            key={key}
                            name={typeValue}
                            id={typeKey}
                            checked={(values[typeValue])}
                            onChange={handleChange}
                        />
                    </div>)}
                </section>
                <section className="subject">
                    <p className="sectionTitle">Options de langue :</p>
                    { Object.entries(TrainingLanguage).map(([languageKey, languageValue], key) => <div key={key}>
                        <label key={`label-${key}`} htmlFor={languageKey}>{languageToString[languageValue]} : </label>
                        <Checkbox
                            key={key}
                            name={languageValue}
                            id={languageKey}
                            checked={(values[languageValue])}
                            onChange={handleChange}
                        />
                    </div>)}
                </section>
                <section className="subject">
                    <p className="sectionTitle">Type de tirage :</p>
                    { Object.entries(TrainingRandomType).map(([randomTypeKey, randomTypeValue], key) => <div key={key}>
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
                    </div>)}
                    { values.randomType === TrainingRandomType.Weighted &&
                        <div className="oneLine">
                            <label>Poids : </label>
                            <Slider
                                name="randomWeight"
                                onChange={(__, e) => handleChange(e)}
                                value={values.randomWeight}
                                min={0}
                                max={100}
                                step={1}
                            />
                            <button className="button" onClick={onRandomTest}>Tester le poids</button>
                        </div>
                    }
                    { values.randomType === TrainingRandomType.Limited && <>
                        <div className="oneLine">
                            <label>Nombre de mots : </label>
                            <Slider
                                name="limitedLength"
                                onChange={(__, e) => handleChange(e)}
                                value={values.limitedLength}
                                min={1}
                                max={100}
                                step={1}
                            />
                        </div>
                        <div className="oneLine">
                            <label>Nombre de répétition : </label>
                            <Slider
                                name="limitedRepetitionNumber"
                                onChange={(__, e) => handleChange(e)}
                                value={values.limitedRepetitionNumber}
                                min={0}
                                max={20}
                                step={1}
                            />
                        </div>
                    </>}
                </section>
                <section className="subject">
                    <p className="sectionTitle">Autres options :</p>
                    <label htmlFor="auto">Mode auto :</label>
                    <Checkbox
                        name="auto"
                        id="auto"
                        checked={values.auto}
                        onChange={handleChange}
                    />
                </section>
                { values.auto &&
                    <section className="subject">
                        <p className="sectionTitle">Options du mode auto :</p>
                        <label>Temps avant réponse (s) : </label>
                        <Slider
                            name="timeBeforeAnswer"
                            onChange={(__, e) => handleChange(e)}
                            value={values.timeBeforeAnswer}
                            min={0}
                            max={20}
                            step={1}
                        />
                        <label>Temps entre deux mots (s) : </label>
                        <Slider
                            name="timeBetweenWord"
                            onChange={(__, e) => handleChange(e)}
                            value={values.timeBetweenWord}
                            min={0}
                            max={20}
                            step={1}
                        />
                    </section>
                }
                <section className="subject">
                    <p className="sectionTitle">Filtres de contenu (facultatif):</p>
                    { Object.entries(TrainingFilters).map(([filterKey, filterValue], key) => <div key={key}>
                        <label key={`label-${key}`} htmlFor={filterKey}>{filtersToString[filterValue]} : </label>
                        <Checkbox
                            key={key}
                            name={filterValue}
                            id={filterKey}
                            checked={(values[filterValue])}
                            onChange={handleChange}
                        />
                    </div>)}
                    <div>
                        <label>Créé depuis : </label>
                        <Slider
                            id="todayFilter"
                            value={values.createdSince}
                            name="createdSince"
                            onChange={(__, e) => handleChange(e)}
                            formatValue={(v) => v === 0 ?
                                "Desactivé"
                                : `${v} jour${v > 1 ? "s" : ""}`}
                            min={0}
                            max={14}
                            step={1}
                        />
                    </div>
                    <div className="tags oneLine">
                        {currentTags?.map((t, i) => <TagDisplay key={i} tag={t} onRemove={handleRemoveTag}/>)}
                        <TagInput
                            currentTags={currentTags}
                            tags={tags}
                            createDisabled
                            handleSelectTag={handleAddTag}
                        />
                    </div>
                </section>
                <button className="button" type="submit">Commencer avec {list.length} données</button>
            </form>
        </div>
    ) : <></>;
}
