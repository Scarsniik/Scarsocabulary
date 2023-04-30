import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { ApiKanji } from "src/api/kanjis";
import { ApiVocabulary } from "src/api/vocabulary";
import Layout from "src/components/layout/Layout";
import CardTraining from "src/components/training/CardTraining";
import TrainingSettings from "src/components/training/TrainingSettings";
import { ToastContext } from "src/contexts/ToastContext";
import { ToastType } from "src/models/toast";
import { TrainingLanguage, TrainingRandomType, TrainingSettingsData } from "src/models/training";
import { Kanji, Word } from "src/models/word";
import "src/styles/training/trainingHome.scss";

export default function TrainingHome() {
  const [settings, setSettings] = useState<TrainingSettingsData>();
  const [words, setWords] = useState<Word[]>();
  const [kanjis, setKanjis] = useState<Kanji[]>();
  const [currentData, setCurrentData] = useState<Kanji|Word>();
  const [alreadyUsed, setAlreadyUsed] = useState<(Kanji|Word)[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<TrainingLanguage>();

  const toast = useContext(ToastContext);

  useEffect(() => {
    if (words && kanjis) {
      nextData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, kanjis])

  async function fetchVocabulary() {
    setWords(await ApiVocabulary.getVocabulary());
  }

  async function fetchKanji() {
    setKanjis(await ApiKanji.getKanjis());
  }

  function onStart(settings: TrainingSettingsData) {
    setSettings(settings);
    fetchVocabulary();
    fetchKanji();
  }

  function nextData() {
    if (words && settings) {
      const languageList: TrainingLanguage[] = [];
      if (settings.fromFrench) {
        languageList.push(TrainingLanguage.FromFrench);
      }
      if (settings.fromKanji) {
        languageList.push(TrainingLanguage.FromKanji);
      }
      if (settings.fromKana) {
        languageList.push(TrainingLanguage.FromKana);
      }
      const randomLanguage = languageList[Math.floor(Math.random() * languageList.length)];

      let newList: (Kanji|Word)[] = [];
      if (settings.kanji) {
        newList = newList.concat(kanjis as [])
      }
      if (settings.vocabulary) {
        newList = newList.concat(words as [])
      }

      if (randomLanguage === TrainingLanguage.FromKanji) {
        newList = newList.filter((w) => !!w.kanji && w.kanji !== "");
      }
      
      if (settings.createdSince > 0) {
        newList = newList.filter((w) => (w.createdAt && moment(w.createdAt).isBetween(moment().subtract(settings.createdSince, 'days'), moment(), 'day', '[]')));
      }
      if (settings.tags.length > 0) {
        newList = newList.filter((w) => {
          const word = w as Word;
          const hadTags = word.tags && word.tags.length > 0;
          return hadTags && settings.tags.some(t => (word.tags as string[]).includes(t))
        });
      }
      const lengthBeforeNoDouble = newList.length;
      if (settings.randomType === TrainingRandomType.NoDouble) {
        newList = newList.filter((w) => !alreadyUsed?.includes(w));
      }
      if (newList.length === 0) {
        toast.add({type: ToastType.Error, title: "Erreur", body: "Aucun mot ne corrrespond à la séléction."});
        return;
      }
      const randomWord = newList[Math.floor(Math.random() * newList.length)];

      if (settings.randomType === TrainingRandomType.NoDouble) {
        let newAlreadyUsed = [...alreadyUsed, randomWord];
        if (newAlreadyUsed.length === lengthBeforeNoDouble) newAlreadyUsed = [];
        setAlreadyUsed(newAlreadyUsed);
      }

      setCurrentData(randomWord);
      setCurrentLanguage(randomLanguage);
    }
  }

  return (
    <Layout center>
      <div className="trainingHome">
        <h2 className="title">Entrainement</h2>
        { settings && currentData && currentLanguage ? (
          <CardTraining data={currentData} onFinish={nextData} language={currentLanguage}/>
        ) : (
          <TrainingSettings onStart={onStart}/>
        )}
      </div>
    </Layout>
  );
}
