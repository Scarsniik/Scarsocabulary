import React, { ChangeEvent } from 'react';
import { useState } from 'react';
import { classNames } from 'src/utils/classNames';
import { v4 as uuidv4 } from "uuid";

import "src/styles/utils/checkbox.scss";

interface Props {
    id?: string;
    checked?: boolean;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    name?: string
    key?: string | number;
}

function Checkbox ({ checked, onChange, className, id, name }: Props) {
    const [randomId] = useState(id ?? uuidv4());

    return (
        <span className="checkbox">
            <input
                type="checkbox"
                id={randomId}
                checked={checked}
                onChange={onChange}
                name={name}
            />
            <label htmlFor={randomId} className={classNames("custom-checkbox__indicator", className)} />
        </span>
    );
}

export default Checkbox;
