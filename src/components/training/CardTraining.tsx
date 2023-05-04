
import { useCallback, useEffect, useMemo, useState } from "react";
import { TrainingLanguage, TrainingSubject } from "src/models/training";
import { Kanji, Word } from "src/models/word";
import "src/styles/training/cardTraining.scss";
import { classNames } from "src/utils/classNames";
import { isWord } from "src/utils/types";
import { ScoreChangesType, changeDataScore, getColorFromScore } from "src/utils/words";

interface Props {
    data: Kanji | Word;
    language: TrainingLanguage;
    onFinish: (data?: Kanji | Word) => void;
    useScore: boolean;
}

export default function CardTraining(props: Props) {
    const { data, language, onFinish, useScore } = props;

    const [showResponse, setShowResponse] = useState<boolean>(false);
    const [lastData, setLastData] = useState<Kanji | Word>();

    const type = useMemo<TrainingSubject>(() => {
        return isWord(data) ? TrainingSubject.Vocabulary : TrainingSubject.Kanji;
    }, [data]);

    const toDisplay = useMemo<string>(() => {
        if (isWord(data)) {
            switch (language) {
                case TrainingLanguage.FromFrench:
                    return data.name;
                case TrainingLanguage.FromKana:
                    return data.kana;
                case TrainingLanguage.FromKanji:
                    return data.kanji !== undefined && data.kanji !== "" ? data.kanji : data.kana;
                default:
                    return "ERROR";
            }
        } else {
            switch (language) {
                case TrainingLanguage.FromFrench:
                    return data.name;
                case TrainingLanguage.FromKana:
                    return data.kanji;
                case TrainingLanguage.FromKanji:
                    return data.kanji;
                default:
                    return "ERROR";
            }
        }
    }, [data, language, type]);

    const showAnswer = useCallback(() => {
        setLastData(data);
    }, [data]);

    function scoreButtonClick(type: ScoreChangesType) {
        const newData = changeDataScore(data, type);
        onFinish(newData);
    }

    const handleShortcut = useCallback((e: KeyboardEvent) => {
        const {key} = e;
        if (useScore) {
            if (["ArrowRight", "ArrowLeft", "ArrowDown"].includes(key) && showResponse) {
                let newData;
                switch (key) {
                    case "ArrowRight":
                        newData = changeDataScore(data, ScoreChangesType.Positive);
                    break;
                    case "ArrowLeft":
                        newData = changeDataScore(data, ScoreChangesType.Negative);
                    break;
                    case "ArrowDown":
                        newData = changeDataScore(data, ScoreChangesType.Neutral);
                    break;
                }
                onFinish(newData);
            } else if (["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(key)) {
                showAnswer();
            }
        } else {
            switch (key) {
                case "ArrowRight":
                    onFinish();
                break;
            }
        }
        if (key === "Enter") { 
            if (showResponse) {
                onFinish();
            } else {
                showAnswer();
            }
        }
    }, [onFinish, showAnswer, showResponse, data, useScore]);

    useEffect(() => {
        document.addEventListener("keyup", handleShortcut);

        return () => {
            document.removeEventListener("keyup", handleShortcut);
        };
    }, [handleShortcut]);

    useEffect(() => {
        setShowResponse(false);
    }, [data, language]);

    useEffect(() => {
        if (lastData && lastData === data) {
            setShowResponse(true);
        }
    }, [lastData, data]);

    return (<>
        <div className="cardTraining">
            <div className={classNames("card", showResponse && "turn")}>
                <div className={classNames("back", lastData !== data && "hidde")}>
                    <p>{data.name}</p>
                    {(data as Word).kana &&
                        <p>{(data as Word).kana}</p>
                    }
                    { data.kanji &&
                        <p>{data.kanji}</p>
                    }
                    { useScore && <>
                        <span className="colorFromScore" style={{backgroundColor: getColorFromScore(data.score ?? 6)}}/>
                        <div className="responseButtons">
                            <button className="button" onClick={() => scoreButtonClick(ScoreChangesType.Negative)}>-</button>
                            <button className="button" onClick={() => scoreButtonClick(ScoreChangesType.Neutral)}>=</button>
                            <button className="button" onClick={() => scoreButtonClick(ScoreChangesType.Positive)}>+</button>
                        </div>
                    </>}
                </div>
                <div className="front">
                    { useScore &&
                        <span className="colorFromScore" style={{backgroundColor: getColorFromScore(data.score ?? 6)}}/>
                    }
                    <p>{toDisplay}</p>
                    <button className="button answerButton" onClick={showAnswer}>Réponse</button>
                </div>
            </div>
            <button className="button" onClick={() => onFinish()}>Suivant</button>
        </div>
        <h3>Raccourcis clavier</h3>
        { useScore ? <>
            <p>Réponse cachée</p>
            <ul>
                <li>Entrer: Montrer la réponse</li>
                <li>Flèches directionnelles: Montrer la réponse</li>
            </ul>
            <p>Réponse visible</p>
            <ul>
                <li>Fleche de gauche: Mauvaise réponse</li>
                <li>Fleche du bas: Réponse moyenne</li>
                <li>Fleche de droite: Bonne réponse</li>
            </ul>
        </> : <>
            <p>Réponse cachée</p>
            <ul>
                <li>Entrer: Montrer la réponse</li>
                <li>Flèches de droite: Carte suivante</li>
            </ul>
            <p>Réponse visible</p>
            <ul>
                <li>Entrer: Carte suivante</li>
                <li>Flèches de droite: Carte suivante</li>
            </ul>
        </>}
    </>);
}
