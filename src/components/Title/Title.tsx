import React from "react";

interface TitleProps {
  blacktext: string;
  className?: string;
}

export const Title: React.FC<TitleProps> = (props) => {
  return (
    <h3 className={`${props.className} title_h3`}>
      {props.blacktext}
      <br />
      <span className="title_span">click'n'shop</span>
    </h3>
  );
};
