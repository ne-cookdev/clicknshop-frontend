import React from "react";

interface TipProps {
  text_name: string;
  text_desc: string;
  type: "small" | "medium" | "double";
}

export const Tip: React.FC<TipProps> = (props) => {
  const { text_name, text_desc, type } = props;

  let additionalClasses = "";
  if (type === "small") {
    additionalClasses = "mb-[110px] ml-[-60px]";
  } else if (type === "medium") {
    additionalClasses = "mb-[110px] ml-[-40px]";
  } else if (type === "double") {
    additionalClasses = "mb-[90px] ml-[110px]";
  }

  return (
    <div className={`tip_div ${additionalClasses}`}>
      <p className="tip_name">
        {text_name} <span className="tip_desc">- {text_desc}</span>
      </p>
    </div>
  );
};
