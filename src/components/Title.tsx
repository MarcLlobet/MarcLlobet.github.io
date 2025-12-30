import styled from "styled-components";

const StyledTitle = styled.h3`
  word-wrap: break-word;
  word-break: break-word;
  inline-size: 100%;
  padding-block-end: 1rem;
`;

const highlightLetters = ['o', 'g', 'd', 'e']

const getStylizedTitle = (title: string) => {
  const letters = title.replaceAll('-', ' ').split('');

  bigIteration: for(let l = 0; l < highlightLetters.length; l++) {
    for(let i = 0; i < letters.length; i++) {
      if (letters[i] === highlightLetters[l]) {
        letters[i] = `<span style="color: var(--color-accent)">${letters[i]}</span>`;
        break bigIteration;
      }
    }
  }

  return letters.join('');
};

export const Title = ({title}: {title: string}) => {
  const stylizedTitle = getStylizedTitle(title);
  return (
    <StyledTitle dangerouslySetInnerHTML={{ __html: stylizedTitle }} />
  );
}