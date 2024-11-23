import React from "react";
import { Squircle } from "@squircle-js/react";
import { RightArrow } from "../Icons/RightArrow";

interface CardLessonProps {
  href: string;
  name: string;
  description: string;
}

export const CardLesson: React.FC<CardLessonProps> = (props) => {
  return (
    <a href={props.href}>
      <div className="cardlesson_background">
        <h1 className="cardlesson_name">{props.name}</h1>
        <p className="cardlesson_description">{props.description}</p>
        <div className="cardlesson_start_div">
          <RightArrow className="cardlesson_start_icon" />
        </div>
      </div>
    </a>
  );
};
