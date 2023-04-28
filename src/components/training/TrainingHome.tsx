import { useEffect, useState } from "react";
import { ApiKanji } from "src/api/kanjis";
import { ApiVocabulary } from "src/api/vocabulary";
import Layout from "src/components/layout/Layout";
import CardTraining from "src/components/training/CardTraining";
import TrainingSettings from "src/components/training/TrainingSettings";
import { TrainingLanguage, TrainingSettingsData } from "src/models/training";
import { Kanji, Word } from "src/models/word";
import "src/styles/training/trainingHome.scss";

export default function TrainingHome() {
  const [settings, setSettings] = useState<TrainingSettingsData>();
  const [words, setWords] = useState<Word[]>();
  const [kanjis, setKanjis] = useState<Kanji[]>();
  const [currentData, setCurrentData] = useState<Kanji|Word>();
  const [currentLanguage, setCurrentLanguage] = useState<TrainingLanguage>();

  useEffect(() => {
    if (settings) {
      fetchVocabulary();
      fetchKanji();
    }
  }, [settings]);

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
      const randomWord = newList[Math.floor(Math.random() * newList.length)];

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
          <TrainingSettings onStart={setSettings}/>
        )}
      </div>
    </Layout>
  );
}
