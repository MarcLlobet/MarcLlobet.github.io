"use client";

import { StyledTitle } from "./Title.styles";

export type TitleProps = {
  title: string;
  id?: string;
};

const getLongestWordLength = (title: string) =>
  Math.max(...title.split(/[\s-]+/).map((word) => word.length), 1);

export const Title = ({ title, id }: TitleProps) => (
  <StyledTitle id={id} $longestWord={getLongestWordLength(title)}>
    {title.replaceAll("-", " ")}
  </StyledTitle>
);
