import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { throttle } from "../utils/throttle";
import type { Repository } from "../services";
import { SectionWrapper } from "./SectionWrapper";

const toVisible = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const ScreenWrapper = styled.div`
  opacity: 0;
  animation: ${toVisible} 300ms ease-in forwards 2s;
  display: flex;
  flex-direction: row;
  top: 0;
`

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const MainWrapper = styled.main`
  display: flex;
  flex-direction: column;
`


export const PageWrapper = ({ repositories }: { repositories: Repository[] }) => {

  return (
    <>
      <ScreenWrapper>
        <ColumnWrapper>
          <MainWrapper>
            {repositories.map(repository => 
              <SectionWrapper 
                key={repository.id}
                repository={repository}
              />
            )}
          </MainWrapper>
        </ColumnWrapper>
      </ScreenWrapper>
    </>
  )
}
