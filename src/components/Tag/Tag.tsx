import React from "react";

interface TagProps {
  text: string;
  classNamediv?: string;
  classNamespan?: string;
}

export const Tag: React.FC<TagProps> = (props) => {
  return (
    <div className={`${props.classNamediv ? props.classNamediv : "tag_div"}`}>
      <span className={`${props.classNamespan ? props.classNamespan : "tag_span"}`}>{props.text}</span>
    </div>
  );
};
