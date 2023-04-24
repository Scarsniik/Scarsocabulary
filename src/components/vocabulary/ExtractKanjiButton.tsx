import { saveAs } from "file-saver";
import { ApiVocabulary } from "src/api/vocabulary";

export default function ExportButton() {
  async function handleExtract() {
    const startTime = Date.now();
    const kanjiList = await ApiVocabulary.getKanjiList();
    const endTime = Date.now();
    console.log(`Temps d'exécution: ${endTime - startTime} ms`);
    console.log(kanjiList);
    const blob = new Blob([JSON.stringify(kanjiList)], { type: "application/json;charset=utf-8" });

    saveAs(blob, "kanjis.json");
  }

  return (
    <button onClick={handleExtract}>
        漢字
    </button>
  );
}
