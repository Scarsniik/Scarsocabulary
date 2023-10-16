import { useCallback, useEffect, useMemo, useState } from "react";
import { TrainingLanguage } from "src/models/training";
import { Kanji, Word } from "src/models/word";
import { classNames } from "src/utils/classNames";
import { isWord } from "src/utils/types";
import { ScoreChangesType, changeDataScore, getColorFromScore } from "src/utils/words";
import { CurrentData } from "src/components/training/TrainingHome";
import { ttsFr, ttsJp } from "src/utils/tts";

import "src/styles/training/cardTraining.scss";

interface Props {
    currentData: CurrentData;
    language: TrainingLanguage;
    onFinish: (data?: Kanji | Word) => void;
    useScore: boolean;
    auto?: boolean;
    timeBeforeAnswer: number,
    timeBetweenWord: number,
}

export default function CardTraining(props: Props) {
    const { language, onFinish, useScore, currentData, auto, timeBeforeAnswer, timeBetweenWord } = props;

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
        if (auto && showResponse && (lastData === currentData.data)) {
            const setTimer = () => setTimeout(onFinish , timeBetweenWord * 1000);
            if (language === TrainingLanguage.FromFrench) {
                if ((currentData.data as Word).kana) {
                    ttsJp((currentData.data as Word).kana, setTimer);
                } else {
                    ttsJp(currentData.data.kanji, setTimer);
                }
            } else {
                ttsFr(currentData.data.name, setTimer);
            }
        } else if (auto && (lastData !== currentData.data)) {
            const setTimer = () => setTimeout(showAnswer , timeBeforeAnswer * 1000);;
            if (language === TrainingLanguage.FromFrench) {
                ttsFr(currentData.data.name, setTimer);
            } else {
                if ((currentData.data as Word).kana) {
                    ttsJp((currentData.data as Word).kana, setTimer);
                } else {
                    ttsJp(currentData.data.kanji, setTimer);
                }
            }
        }
    }, [showResponse, auto, language, currentData.data, lastData, showAnswer, onFinish, timeBeforeAnswer, timeBetweenWord]);

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
