"use client";

import { useState } from "react";
import { BackButton } from "../BackButton";
import { Mockup } from "../Mockup";
import type { MockupKind } from "../../mockups";
import {
  displayName,
  formatMonthYear,
  splitDescription,
  visibleTopics,
} from "../../utils/projects";
import type { Repository } from "../../types";
import { useCopy } from "../../utils/copy";
import {
  Data,
  Detail,
  Languages,
  LanguageBar,
  LanguageLegend,
  LanguageSegment,
  Layout,
  Links,
  Shot,
  ShotFallback,
  ShotImage,
  Stats,
  Tag,
  Tagline,
  Tags,
  TextColumn,
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
  const { t } = useCopy();
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
      <BackButton />
      <Layout>
        <TextColumn>
          <Title>{name}</Title>
          <Tagline>{tagline}</Tagline>
          {detail && <Detail>{detail}</Detail>}
          <Data>
            {tags.length > 0 && (
              <Tags
                role="group"
                aria-label={t("projectContent.topicsAriaLabel")}
              >
                {tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </Tags>
            )}
            <Stats>
              <dt>{t("projectContent.created")}</dt>
              <dd>{formatMonthYear(repository.createdAt)}</dd>
              <dt>{t("projectContent.lastPushed")}</dt>
              <dd>{formatMonthYear(repository.pushedAt)}</dd>
            </Stats>
            {totalBytes > 0 && (
              <Languages
                role="group"
                aria-label={t("projectContent.languagesAriaLabel")}
              >
                <LanguageBar>
                  {repository.languages.map(({ name: lang, color, bytes }) => (
                    <LanguageSegment
                      key={lang}
                      $grow={bytes ?? 0}
                      $color={color}
                    />
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
          </Data>
        </TextColumn>
        <Shot $accent={accent}>
          {repository.preview && !imageFailed ? (
            <ShotImage
              src={repository.preview}
              alt={`${t("projectContent.screenshotAltPrefix")}${name}`}
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <ShotFallback data-play="always">
              <Mockup kind={kind} />
            </ShotFallback>
          )}
        </Shot>
      </Layout>
      <Links>
        {repository.homepageUrl && (
          <a
            href={repository.homepageUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("projectContent.liveDemoLabel")}
          </a>
        )}
        <a href={repository.url} target="_blank" rel="noopener noreferrer">
          {t("projectContent.codeLabel")}
        </a>
      </Links>
    </article>
  );
};
