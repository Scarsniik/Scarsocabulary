import React, { ChangeEvent, FormEvent, useState } from "react";
import { classNames } from "src/utils/classNames";

import "src/styles/utils/inputTextDropdown.scss";

export interface InputTextDropdownItem {
  label: string;
  image?: string;
}

interface Props {
  content?: InputTextDropdownItem[];
  className?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  clearOnSubmit?: boolean;
}

export default function InputTextDropdown(props: Props) {
  const {
    onChange,
    onSubmit,
    className,
    clearOnSubmit,
    content,
  } = props;

  const [value, setValue] = useState<string>("");
  const [matchingContent, setMatchingContent] = useState<InputTextDropdownItem[]>([]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.value;
    setValue(newValue);
    if (onChange) {
      onChange(value);
    }
    if (content && newValue.length >= 3) {
      const formatedValue = newValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const matching = content.filter(
        item => item.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").startsWith(formatedValue)
      );
      setMatchingContent(getUniqueObjects(matching));
    }
  }

  // remove duplicate on a list
  function getUniqueObjects(objects: InputTextDropdownItem[]): InputTextDropdownItem[] {
    const uniqueObjects: InputTextDropdownItem[] = [];

    for (const obj of objects) {
      const duplicate = uniqueObjects.find(uniqueObj => uniqueObj.label === obj.label);

      if (!duplicate) {
        uniqueObjects.push(obj);
      }
    }

    return uniqueObjects;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(value);
    }
    if (clearOnSubmit) {
      setValue("");
      setMatchingContent([]);
    }
  }

  return (
    <div className={classNames("inputTextDropdown", className)}>
      <form onSubmit={handleSubmit}>
        <input value={value} type="text" onChange={handleChange} />
        <div className="suggestions">
          {matchingContent.map((item, key) => (
            <button key={key} onClick={() => setValue(item.label)}>{item.label}</button>
          ))}
        </div>
      </form>
    </div>
  );
}