import React, { ChangeEvent, useState } from 'react';
import { classNames } from 'src/utils/classNames';
import { v4 as uuidv4 } from "uuid";

import "src/styles/utils/slider.scss";

interface Props {
    id?: string;
    onChange?: (value: number, e: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    name?: string
    key?: string | number;
    value?: number;
    formatValue?: (value: number) => string | number;
}

export default function Slider ({ onChange, formatValue, className, id, name, value }: Props) {
    const [randomId] = useState(id ?? uuidv4());

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(parseFloat(e.target.value), e);
        }
    }

    return (
        <span className={classNames("slider", className)}>
            <input type="range" className="slider__input" id={randomId} name={name} min="0" max="14" step="1" value={value} onChange={handleChange} />
            { value !== undefined &&
                <span className="slider__value">{formatValue ? formatValue(value) : value}</span>
            }
        </span>
    );
}
