"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import {
  accentFor,
  displayName,
  splitDescription,
  visibleLanguages,
} from "../../utils/projects";
import { setTransitionOrigin } from "../../utils/pageTransition";
import { useCopy } from "../../utils/copy";
import type { Repository } from "../../types";
import {
  Head,
  List,
  Row,
  RowGo,
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

const isPlainClick = (event: MouseEvent) =>
  event.button === 0 &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey;

/** Every other "demo" project, as a typographic index linking to its own page. */
export const ArchiveIndex = ({ repositories }: ArchiveIndexProps) => {
  const { t } = useCopy();
  return (
    <Section id="archive" aria-labelledby="archive-title">
      <Head>
        <span>{t("archive.eyebrow")}</span>
        <span>
          ({pad(repositories.length)}) {t("archive.taggedDemoSuffix")}
        </span>
      </Head>
      <Title id="archive-title">{t("archive.title")}</Title>
      <List>
        {repositories.map((repository, index) => (
          <li key={repository.id}>
            <Row
              as={Link}
              href={`/projects/${repository.name}`}
              onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                if (isPlainClick(event))
                  setTransitionOrigin(event.currentTarget);
              }}
              $accent={accentFor(index)}
            >
              <RowNumber>{pad(index + 1)}</RowNumber>
              <RowName>
                {displayName(repository.name)}
                <RowGo aria-hidden="true">↗</RowGo>
              </RowName>
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
};
