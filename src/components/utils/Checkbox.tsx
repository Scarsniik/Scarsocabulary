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
    radio?: boolean;
    value?: any;
}

function Checkbox ({ checked, onChange, className, id, name, radio, value }: Props) {
    const [randomId] = useState(id ?? uuidv4());

    return (
        <span className={classNames("checkbox", radio && "radio")}>
            <input
                type={radio ? "radio" : "checkbox"}
                id={randomId}
                checked={checked}
                onChange={onChange}
                name={name}
                value={value}
            />
            <label htmlFor={randomId} className={classNames("custom-checkbox__indicator", radio && "radio", className)} />
        </span>
    );
}

export default Checkbox;
