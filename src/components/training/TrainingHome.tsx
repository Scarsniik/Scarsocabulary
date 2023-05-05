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
import { getRandomElementWithScore } from "src/utils/words";

import "src/styles/training/trainingHome.scss";

export interface CurrentData {
  date: number;
  data: Kanji | Word;
}

export default function TrainingHome() {
  const [settings, setSettings] = useState<TrainingSettingsData>();
  const [words, setWords] = useState<Word[]>();
  const [kanjis, setKanjis] = useState<Kanji[]>();
  const [currentData, setCurrentData] = useState<CurrentData>();
  const [alreadyUsed, setAlreadyUsed] = useState<(Kanji|Word)[]>([]);
  const [filteredList, setFilteredList] = useState<(Kanji|Word)[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<TrainingLanguage>();

  const toast = useContext(ToastContext);

  useEffect(() => {
    if (!words) {
      fetchVocabulary();
    }
    if (!kanjis) {
      fetchKanji();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (settings && words && kanjis) {
      filterData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, words, kanjis])

  async function fetchVocabulary() {
    setWords(await ApiVocabulary.getVocabulary());
  }

  async function fetchKanji() {
    setKanjis(await ApiKanji.getKanjis());
  }

  function onSettingsChanges(settings: TrainingSettingsData) {
    setSettings(settings);
  }

  function filterData() {
    if (settings) {
      let list: (Kanji|Word)[] = [];
      if (settings.kanji) {
        list = list.concat(kanjis as [])
      }
      if (settings.vocabulary) {
        list = list.concat(words as [])
      }
      
      if (settings.createdSince > 0) {
        list = list.filter((w) => (w.createdAt && moment(w.createdAt).isBetween(moment().subtract(settings.createdSince, 'days'), moment(), 'day', '[]')));
      }
      if (settings.tags.length > 0) {
        list = list.filter((w) => {
          const word = w as Word;
          const hadTags = word.tags && word.tags.length > 0;
          return hadTags && settings.tags.some(t => (word.tags as string[]).includes(t))
        });
      }

      // testRandomElementWithScore(list);
      setFilteredList(list);
    }
  }

  function nextData(responseData?: Kanji | Word) {
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

      if (filteredList.length === 0) {
        toast.add({type: ToastType.Error, title: "Erreur", body: "Aucun mot ne corrrespond à la séléction."});
        return;
      }

      const lengthBeforeNoDouble = filteredList.length;
      let list = filteredList;
      if (responseData) {
        const id = list.findIndex(d => d._id === responseData._id);
        list[id] = responseData;
      }
      if (settings.randomType === TrainingRandomType.NoDouble) {
        list = list.filter((w) => !alreadyUsed?.includes(w));
      }

      let randomWord;
      if (settings.randomType === TrainingRandomType.Weighted) {
        randomWord = getRandomElementWithScore(list, settings.randomWeight / 10);
      } else {
        randomWord = list[Math.floor(Math.random() * list.length)];
      }

      if (settings.randomType === TrainingRandomType.NoDouble) {
        let newAlreadyUsed = [...alreadyUsed, randomWord];
        if (newAlreadyUsed.length === lengthBeforeNoDouble) newAlreadyUsed = [];
        setAlreadyUsed(newAlreadyUsed);
      }


      setCurrentData({
        data: randomWord,
        date: Date.now(),
      });
      setCurrentLanguage(randomLanguage);
    }
  }

  return (
    <Layout center>
      <div className="trainingHome">
        <h2 className="title">Entrainement</h2>
        { settings && currentData && currentLanguage ? (
          <CardTraining currentData={currentData} onFinish={nextData} language={currentLanguage} useScore={settings.randomType === TrainingRandomType.Weighted}/>
        ) : (
          <TrainingSettings onSettingsChanges={onSettingsChanges} list={filteredList} onStart={nextData}/>
        )}
      </div>
    </Layout>
  );
}
