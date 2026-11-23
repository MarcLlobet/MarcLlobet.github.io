"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { Mockup } from "../Mockup";
import type { MockupKind } from "../../mockups";
import {
  displayName,
  splitDescription,
  visibleLanguages,
} from "../../utils/projects";
import { setTransitionOrigin } from "../../utils/pageTransition";
import type { Repository } from "../../types";
import {
  Body,
  Case,
  Detail,
  Dot,
  Frame,
  Index,
  Languages,
  Links,
  Meta,
  Name,
  Shot,
  Tagline,
  Text,
} from "./ProjectCase.styles";

export type ProjectCaseProps = {
  repository: Repository;
  index: number;
  total: number;
  accent: string;
  kind: MockupKind;
};

const pad = (n: number) => String(n).padStart(2, "0");

const isPlainClick = (event: MouseEvent) =>
  event.button === 0 &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey;

export const ProjectCase = ({
  repository,
  index,
  total,
  accent,
  kind,
}: ProjectCaseProps) => {
  const titleId = `title-${repository.name}`;
  const even = index % 2 === 1;
  const name = displayName(repository.name);
  const { tagline, detail } = splitDescription(repository.description);
  const demo = repository.homepageUrl;

  const handleFrameClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isPlainClick(event)) setTransitionOrigin(event.currentTarget);
  };

  return (
    <Case
      className="page-section"
      id={repository.name}
      aria-labelledby={titleId}
      data-case={repository.name}
      data-accent={accent}
      $accent={accent}
      $even={even}
    >
      <Meta>
        <Index>
          <Dot aria-hidden="true" />
          {pad(index + 1)} / {pad(total)}
        </Index>
        <Languages>
          {visibleLanguages(repository).map((language) => (
            <span key={language}>{language}</span>
          ))}
        </Languages>
      </Meta>
      <Name id={titleId} $even={even}>
        {name}
      </Name>
      <Body>
        <Frame
          as={Link}
          href={`/work/${repository.name}`}
          aria-label={`View ${name}`}
          data-frame="true"
          data-play="hover"
          data-cursor="View project ↗"
          onClick={handleFrameClick}
          $even={even}
        >
          <Shot data-shot="true">
            <Mockup kind={kind} />
          </Shot>
        </Frame>
        <Text $even={even}>
          <Tagline>{tagline}</Tagline>
          {detail && <Detail>{detail}</Detail>}
          <Links>
            {demo && (
              <a
                href={demo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Live demo of ${name}`}
              >
                Live demo ↗
              </a>
            )}
            <a
              href={repository.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Code of ${name}`}
            >
              Code ↗
            </a>
          </Links>
        </Text>
      </Body>
    </Case>
  );
};
