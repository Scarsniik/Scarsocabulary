import { ChangeEvent, FormEvent, Fragment, useMemo, useState } from "react";
import Checkbox from "src/components/utils/Checkbox";
import Slider from "src/components/utils/Slider";
import { TrainingFilters, TrainingLanguage, TrainingRandomType, TrainingSettingsData, TrainingSubject, TrainingType } from "src/models/training";

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
}

const settingsKey = "trainingSettings";

interface Props {
    onStart: (settings: TrainingSettingsData) => void;
}

export default function TrainingSettings({onStart: onSettingsChange}: Props) {
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
        }, ...(savedSettings ?? {})}
    )

    console.log(values);

    function handleChange (event: ChangeEvent<HTMLInputElement>) {
        const { name, value, type, checked } = event.target;
        let processedValue: any = value;
        if (type === "checkbox") processedValue = checked;
        if (type === "range") processedValue = parseInt(processedValue);
        const newValues = { ...values, [name]: processedValue };
        localStorage.setItem(settingsKey, JSON.stringify(newValues));
        setValues(newValues);
      }

    function start(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onSettingsChange(values);
    }
    return (
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
                </section>
                <button className="button" type="submit">Lancer l'entrainement</button>
            </form>
        </div>
    );
}
