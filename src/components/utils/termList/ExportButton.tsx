import { saveAs } from "file-saver";
import { Word } from "src/models/word";
import Svg from "src/components/utils/Svg";
import DownloadIcon from "src/assets/img/download.svg"

type ExportButtonProps<T> = {
  items: T[];
};

export default function ExportButton<T>({ items }: ExportButtonProps<T>) {
  const handleExport = () => {
    const exportData = JSON.stringify(items, null, 2);
    const blob = new Blob([exportData], { type: "application/json;charset=utf-8" });

    saveAs(blob, "vocabulary.json");
  };

  return (
    <button onClick={handleExport}>
        <Svg src={DownloadIcon} />
    </button>
  );
}
