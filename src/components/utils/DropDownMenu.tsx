import { CSSProperties, RefObject, useCallback, useEffect, useRef, useState } from "react";
import { classNames } from "src/utils/classNames";
import OutsideAlerter from "src/components/utils/ClickOutsideAlerter";
import ExpandsIcon from "src/assets/img/expands.svg";
import { MenuItem } from "src/models/menuItem";

import "src/styles/utils/dropDownMenu.scss";
import Svg from "src/components/utils/Svg";

interface Props {
  content: MenuItem[];
  className?: string;
  children?: JSX.Element | string;
  refreshTrigger?: number;
  disabled?: boolean;
}

export default function DropDownMenu(props: Props) {
  const { content, className, children, refreshTrigger, disabled } = props;

  const [opened, setOpened] = useState<boolean>(false);
  const [style, setStyle] = useState<CSSProperties | undefined>();

  const contentRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>() as any;

  // FUNCTIONS

  const getStyle = useCallback((noTransition: boolean): CSSProperties | undefined => {
    if (!opened || !contentRef.current) return;

    const { top: startPosition, height: contentHeight } = contentRef.current.getBoundingClientRect();
    const windowSize = window.innerHeight;
    const availableSize = windowSize - startPosition;
    const isOverflow = contentHeight > availableSize;

    return {
        height: isOverflow ? availableSize : contentHeight,
        overflowY: isOverflow ? "auto" : undefined,
        transition: noTransition ? "unset" : undefined,
    };
  }, [opened]);

  const onClick = useCallback(() => {
    setOpened(!opened);
  }, [opened])

  useEffect(() => {
    if (contentRef) {
      setTimeout(() => setStyle(getStyle(true)), 5);
    }
  }, [refreshTrigger, getStyle]);

  useEffect(() => {
    if (contentRef) {
      setStyle(getStyle(false));
    }
  }, [opened, getStyle]);

  return (
    <div className={classNames("dropDownMenu", opened && "open", className)}>
      <OutsideAlerter onClickOutside={() => setOpened(false)}>
        <div className={classNames("dropDownMenuButton", disabled && "disabled")} onClick={!disabled ? onClick : undefined}>
          { children }
          <Svg src={ExpandsIcon}/>
        </div>
        <div style={style} className="dropDownMenuHidden">
          <div ref={contentRef}>
            { content.map((item, key) => 
              <div key={key} className={classNames("dropDownMenuItem", item.className)}>
                { typeof(item.content) === "string" ?
                  <span>{item.content}</span>
                  : item.content
                }
              </div>
            )}
          </div>
        </div>
      </OutsideAlerter>
    </div>
  );
}
