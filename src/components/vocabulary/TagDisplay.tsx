import { classNames } from 'src/utils/classNames';
import { Tag } from 'src/models/word';

import "src/styles/vocabulary/tagDisplay.scss";

interface Props {
    tag: Tag;
    onRemove?: (tag: Tag) => void;
    className?: string;
    key?: string | number;
}

export default function TagDisplay ({ tag, className, onRemove }: Props) {
    const handleRemove = (e: any) => {
        e.preventDefault();
        if (onRemove) {
            onRemove(tag);
        }
    }

    return (
        <span className={classNames("tag", className)}>
            { tag.name}
            { onRemove &&
                <button onClick={handleRemove}>x</button>
            }
        </span>
    );
}
