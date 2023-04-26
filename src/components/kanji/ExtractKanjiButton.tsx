import { useState } from "react";
import { ApiKanji } from "src/api/kanjis";
import { Kanji } from "src/models/word";

interface Props {
  onFinished: (kanjis: Kanji[]) => void;
}

export default function ExportButton(props: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  async function handleExtract() {
    const startTime = Date.now();
    setLoading(true);
    const kanjiList = await ApiKanji.syncronise();
    setLoading(false);
    const endTime = Date.now();
    console.log(`Temps d'exécution: ${endTime - startTime} ms`);
    props.onFinished(kanjiList.content as Kanji[])
  }

  return (
    <button onClick={handleExtract} disabled={loading}>
        { loading ? "Load" : "漢字" }
    </button>
  );
}
