"use client";

import { ReactNode } from "react";
import { HighlightLetter } from "../../App.styles";
import { StyledTitle } from "./Title.styles";

export type TitleProps = {
  title: string;
  id?: string;
};

const highlightLetters = ["o", "g", "d", "e"];

const getStylizedTitle = (title: string) => {
  const letters: ReactNode[] = title.replaceAll("-", " ").split("");

  let letterIndex: number;

  bigIteration: for (let l = 0; l < highlightLetters.length; l++) {
    for (letterIndex = 0; letterIndex < letters.length; letterIndex++) {
      if (letters[letterIndex] === highlightLetters[l]) {
        letters[letterIndex] = (
          <HighlightLetter key={`${title}-${letterIndex}`}>
            {letters[letterIndex]}
          </HighlightLetter>
        );
        break bigIteration;
      }
    }
  }

  return letters;
};

export const Title = ({ title, id }: TitleProps) => {
  const stylizedTitle = getStylizedTitle(title);
  return <StyledTitle id={id}>{stylizedTitle}</StyledTitle>;
};
