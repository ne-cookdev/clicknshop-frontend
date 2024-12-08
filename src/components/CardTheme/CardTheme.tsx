import React from "react";
import { Squircle } from "@squircle-js/react";
import { Tag } from "../Tag/Tag";
import { CardLesson } from "../CardLesson/CardLesson";
import { useTranslation } from "react-i18next";

interface CardThemeProps {
  courseNum: number;
  themeNum: number;
  countLessons: number;
  tagList?: string[];
  name: string;
  description: string;
  //lessons: Lesson[];
}

export const CardTheme: React.FC<CardThemeProps> = (props) => {
  // Хук для получения переведенных текстов
  const { t } = useTranslation();

  function getLessonText(count: number): string {
    const remainder10 = count % 10;
    const remainder100 = count % 100;

    if (remainder100 >= 11 && remainder100 <= 14) {
      return `${count} ${t("urokov")}`;
    }

    if (remainder10 === 1) {
      return `${count} ${t("urok")}`;
    }

    if (remainder10 >= 2 && remainder10 <= 4) {
      return `${count} ${t("uroka")}`;
    }

    return `${count} ${t("urokov")}`;
  }

  return (
    <Squircle asChild cornerRadius={40} cornerSmoothing={1}>
      <div className="cardtheme_background">
        <div className="cardtheme_left_part">
          <div className="cardtheme_tags_div">
            <Tag key={"count_lessons"} text={getLessonText(props.countLessons)} classNamediv="cardtheme_blue_tag_div" classNamespan="cardtheme_blue_tag_span" />
            {props.tagList?.map((tag) => {
              const isValidTag = tag && /^[\w\sа-яА-ЯёЁ]+$/.test(tag);
              return isValidTag ? <Tag key={tag} text={tag} /> : null;
            })}
          </div>
          <h1 className="cardtheme_name">{props.name}</h1>
          <p className="cardtheme_description">{props.description}</p>
        </div>
        <div className="cardtheme_right_part">
          {/*{props.lessons
            ?.slice()
            .sort((a: Lesson, b: Lesson) => a.number - b.number)
            .map((lesson: Lesson) => (
              <CardLesson key={"/course/" + props.courseNum + "/theme/" + props.themeNum + "/lesson/" + lesson.number} href={"/course/" + props.courseNum + "/theme/" + props.themeNum + "/lesson/" + lesson.number} name={lesson.name} description={lesson.description} />
            ))}*/}
        </div>
      </div>
    </Squircle>
  );
};
