"use client";

import {
  displayName,
  splitDescription,
  visibleLanguages,
} from "../../utils/projects";
import type { Repository } from "../../types";
import {
  Head,
  List,
  Row,
  RowLanguages,
  RowName,
  RowNumber,
  RowTagline,
  Section,
  Title,
} from "./ArchiveIndex.styles";

export type ArchiveIndexProps = {
  repositories: Repository[];
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Every other "demo" project, as a typographic index linking to its code. */
export const ArchiveIndex = ({ repositories }: ArchiveIndexProps) => (
  <Section id="archive" aria-labelledby="archive-title">
    <Head>
      <span>Other experiments</span>
      <span>({pad(repositories.length)}) · Tagged “demo”</span>
    </Head>
    <Title id="archive-title">Archive</Title>
    <List>
      {repositories.map((repository, index) => (
        <li key={repository.id}>
          <Row href={repository.url} target="_blank" rel="noopener noreferrer">
            <RowNumber>{pad(index + 1)}</RowNumber>
            <RowName>{displayName(repository.name)}</RowName>
            <RowLanguages>
              {visibleLanguages(repository).slice(0, 3).join(" · ")}
            </RowLanguages>
            <RowTagline>
              {splitDescription(repository.description).tagline}
            </RowTagline>
          </Row>
        </li>
      ))}
    </List>
  </Section>
);
