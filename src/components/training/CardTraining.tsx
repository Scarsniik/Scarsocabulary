
import { useEffect, useMemo, useState } from "react";
import { TrainingLanguage, TrainingSubject } from "src/models/training";
import { Kanji, Word } from "src/models/word";
import "src/styles/training/cardTraining.scss";
import { classNames } from "src/utils/classNames";
import { isWord } from "src/utils/types";

interface Props {
    data: Kanji | Word;
    language: TrainingLanguage;
    onFinish: () => void;
}

export default function CardTraining(props: Props) {
    const { data, language, onFinish } = props;

    const [showResponse, setShowResponse] = useState<boolean>(false);
    const [lastData, setLastData] = useState<Kanji | Word>();

    const type = useMemo<TrainingSubject>(() => {
        return isWord(data) ? TrainingSubject.Vocabulary : TrainingSubject.Kanji;
    }, [data]);
    const toDisplay = useMemo<string>(() => {
        if (type === TrainingSubject.Vocabulary) {
            switch (language) {
                case TrainingLanguage.FromFrench:
                    return data.name;
                case TrainingLanguage.FromKana:
                    return (data as Word).kana;
                case TrainingLanguage.FromKanji:
                    return data.kanji;
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

    useEffect(() => {
        setShowResponse(false);
    }, [data, language]);

    useEffect(() => {
        if (lastData && lastData === data) {
            setShowResponse(true);
        }
    }, [lastData, data]);


    function showAnswer() {
        setLastData(data);
    }

    function next() {
        onFinish();
    }

    return (
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
                </div>
                <div className="front">
                    <p>{toDisplay}</p>
                    <button className="button" onClick={showAnswer}>Réponse</button>
                </div>
            </div>
            <button className="button" onClick={next}>Suivant</button>
        </div>
    );
}
