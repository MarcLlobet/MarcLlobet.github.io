"use client";

import { useState } from "react";
import { Mockup } from "../Mockup";
import type { MockupKind } from "../../mockups";
import {
  displayName,
  formatMonthYear,
  splitDescription,
  visibleTopics,
} from "../../utils/projects";
import type { Repository } from "../../types";
import copy from "../../content/copy.json";
import {
  Detail,
  Languages,
  LanguageBar,
  LanguageLegend,
  LanguageSegment,
  Links,
  Meta,
  Shot,
  ShotFallback,
  ShotImage,
  Stats,
  Tag,
  Tagline,
  Tags,
  Title,
} from "./ProjectContent.styles";

export type ProjectContentProps = {
  repository: Repository;
  accent: string;
  kind: MockupKind;
};

/** One project's own page: the real screenshot, the full description, its topics, its stats and its language breakdown. */
export const ProjectContent = ({
  repository,
  accent,
  kind,
}: ProjectContentProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  const name = displayName(repository.name);
  const { tagline, detail } = splitDescription(repository.description);
  const tags = visibleTopics(repository);
  const totalBytes = repository.languages.reduce(
    (sum, { bytes }) => sum + (bytes ?? 0),
    0,
  );

  return (
    <article>
      <Meta>{repository.primaryLanguage.name}</Meta>
      <Title>{name}</Title>
      <Shot $accent={accent}>
        {repository.preview && !imageFailed ? (
          <ShotImage
            src={repository.preview}
            alt={`${copy.projectContent.screenshotAltPrefix}${name}`}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <ShotFallback data-play="always">
            <Mockup kind={kind} />
          </ShotFallback>
        )}
      </Shot>
      <Tagline>{tagline}</Tagline>
      {detail && <Detail>{detail}</Detail>}
      {tags.length > 0 && (
        <Tags role="group" aria-label={copy.projectContent.topicsAriaLabel}>
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Tags>
      )}
      <Stats>
        <dt>{copy.projectContent.stars}</dt>
        <dd>{repository.stars}</dd>
        <dt>{copy.projectContent.created}</dt>
        <dd>{formatMonthYear(repository.createdAt)}</dd>
        <dt>{copy.projectContent.lastPushed}</dt>
        <dd>{formatMonthYear(repository.pushedAt)}</dd>
      </Stats>
      {totalBytes > 0 && (
        <Languages
          role="group"
          aria-label={copy.projectContent.languagesAriaLabel}
        >
          <LanguageBar>
            {repository.languages.map(({ name: lang, color, bytes }) => (
              <LanguageSegment key={lang} $grow={bytes ?? 0} $color={color} />
            ))}
          </LanguageBar>
          <LanguageLegend>
            {repository.languages.map(({ name: lang, bytes }) => (
              <span key={lang}>
                {lang} · {Math.round(((bytes ?? 0) / totalBytes) * 100)}%
              </span>
            ))}
          </LanguageLegend>
        </Languages>
      )}
      <Links>
        {repository.homepageUrl && (
          <a
            href={repository.homepageUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {copy.projectContent.liveDemoLabel}
          </a>
        )}
        <a href={repository.url} target="_blank" rel="noopener noreferrer">
          {copy.projectContent.codeLabel}
        </a>
      </Links>
    </article>
  );
};
