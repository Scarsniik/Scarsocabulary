import { ChangeEvent, useRef } from "react";
import { ApiVocabulary } from "src/api/vocabulary";
import Svg from "src/components/utils/Svg";
import UploadIcon from "src/assets/img/upload.svg"
import "src/styles/vocabulary/importButton.scss";

type ImportJSONProps = {
  onImportSuccess: () => void;
};

export default function ImportButton({ onImportSuccess }: ImportJSONProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const jsonData = JSON.parse(reader.result as string);
          ApiVocabulary.importWords(jsonData);
          onImportSuccess();
        } catch (error) {
          console.error(error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="import-button">
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="application/json"
      />
      <button className="styled-button" onClick={handleClick} aria-label="Importer un JSON">
        <Svg src={UploadIcon}/>
      </button>
    </div>
  );
}
