import { useCallback, useEffect, useMemo, useState } from "react";
import { TrainingLanguage } from "src/models/training";
import { Kanji, Word } from "src/models/word";
import { classNames } from "src/utils/classNames";
import { isWord } from "src/utils/types";
import { ScoreChangesType, changeDataScore, getColorFromScore } from "src/utils/words";

import "src/styles/training/cardTraining.scss";
import { CurrentData } from "src/components/training/TrainingHome";

interface Props {
    currentData: CurrentData;
    language: TrainingLanguage;
    onFinish: (data?: Kanji | Word) => void;
    useScore: boolean;
}

export default function CardTraining(props: Props) {
    const { language, onFinish, useScore, currentData } = props;

    const [showResponse, setShowResponse] = useState<boolean>(false);
    const [lastData, setLastData] = useState<Kanji | Word>();

    const toDisplay = useMemo<string>(() => {
        if (isWord(currentData.data)) {
            switch (language) {
                case TrainingLanguage.FromFrench:
                    return currentData.data.name;
                case TrainingLanguage.FromKana:
                    return currentData.data.kana;
                case TrainingLanguage.FromKanji:
                    return currentData.data.kanji !== undefined && currentData.data.kanji !== "" ? currentData.data.kanji : currentData.data.kana;
                default:
                    return "ERROR";
            }
        } else {
            switch (language) {
                case TrainingLanguage.FromFrench:
                    return currentData.data.name;
                case TrainingLanguage.FromKana:
                    return currentData.data.kanji;
                case TrainingLanguage.FromKanji:
                    return currentData.data.kanji;
                default:
                    return "ERROR";
            }
        }
    }, [currentData, language]);

    const showAnswer = useCallback(() => {
        setLastData(currentData.data);
    }, [currentData]);

    function scoreButtonClick(type: ScoreChangesType) {
        const newData = changeDataScore(currentData.data, type);
        onFinish(newData);
    }

    const handleShortcut = useCallback((e: KeyboardEvent) => {
        const {key} = e;
        if (useScore) {
            if (["ArrowRight", "ArrowLeft", "ArrowDown"].includes(key) && showResponse) {
                let newData;
                switch (key) {
                    case "ArrowRight":
                        newData = changeDataScore(currentData.data, ScoreChangesType.Positive);
                    break;
                    case "ArrowLeft":
                        newData = changeDataScore(currentData.data, ScoreChangesType.Negative);
                    break;
                    case "ArrowDown":
                        newData = changeDataScore(currentData.data, ScoreChangesType.Neutral);
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
    }, [onFinish, showAnswer, showResponse, currentData.data, useScore]);

    useEffect(() => {
        document.addEventListener("keyup", handleShortcut);

        return () => {
            document.removeEventListener("keyup", handleShortcut);
        };
    }, [handleShortcut]);

    useEffect(() => {
        setShowResponse(false);
    }, [currentData, language]);

    useEffect(() => {
        if (lastData && lastData === currentData.data) {
            setShowResponse(true);
        }
    }, [lastData, currentData]);

    return (<>
        <div className="cardTraining">
            <div className={classNames("card", showResponse && "turn")}>
                <div className={classNames("back", lastData !== currentData.data && "hidde")}>
                    <p>{currentData.data.name}</p>
                    {(currentData.data as Word).kana &&
                        <p>{(currentData.data as Word).kana}</p>
                    }
                    { currentData.data.kanji &&
                        <p>{currentData.data.kanji}</p>
                    }
                    { useScore && <>
                        <span className="colorFromScore" style={{backgroundColor: getColorFromScore(currentData.data.score ?? 6)}}/>
                        <div className="responseButtons">
                            <button className="button" onClick={() => scoreButtonClick(ScoreChangesType.Negative)}>-</button>
                            <button className="button" onClick={() => scoreButtonClick(ScoreChangesType.Neutral)}>=</button>
                            <button className="button" onClick={() => scoreButtonClick(ScoreChangesType.Positive)}>+</button>
                        </div>
                    </>}
                </div>
                <div className="front">
                    { useScore &&
                        <span className="colorFromScore" style={{backgroundColor: getColorFromScore(currentData.data.score ?? 6)}}/>
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
