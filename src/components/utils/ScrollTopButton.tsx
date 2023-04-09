import React from "react";
import ExpandsIcon from "src/assets/img/expands.svg";
import Svg from "src/components/utils/Svg";

import "src/styles/utils/scrollTopButton.scss";

const ScrollTopButton: React.FC = () => {
  const handleClick = () => {
    window.scrollTo(0, 0);
  }

  return (
    <button className="scroll-top-button" onClick={handleClick}>
      <Svg src={ExpandsIcon}/>
    </button>
  );
};

export default ScrollTopButton;
