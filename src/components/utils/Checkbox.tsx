import React from 'react';
import { useState } from 'react';
import { classNames } from 'src/utils/classNames';
import { v4 as uuidv4 } from "uuid";

import "src/styles/utils/checkbox.scss";

interface Props {
  checked?: boolean;
  onChange?: () => void;
  className?: string;
}

const Checkbox: React.FC<Props> = ({ checked, onChange, className }) => {
    const [randomId] = useState(uuidv4())

    return (
        <span>
            <input
                type="checkbox"
                id={randomId}
                checked={checked}
                onChange={onChange}
            />
            <label htmlFor={randomId} className={classNames("custom-checkbox__indicator", className)} />
        </span>
    );
};

export default Checkbox;
