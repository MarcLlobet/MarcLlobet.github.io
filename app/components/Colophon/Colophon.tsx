"use client";

import { useCopy } from "../../utils/copy";
import { REPO_URL } from "../../constants";
import { splitDescription, visibleLanguages } from "../../utils/projects";
import type { SiteRepository } from "../../types";
import {
  Detail,
  Dot,
  Index,
  Languages,
  Lead,
  Links,
  Meta,
  Section,
  Title,
} from "./Colophon.styles";

export type ColophonProps = {
  id: string;
  /** This repo's own description and languages, straight from GitHub. */
  repository: SiteRepository | null;
};

/** A closing note, not a second front door: how the site itself is made. */
export const Colophon = ({ id, repository }: ColophonProps) => {
  const { t } = useCopy();
  const { tagline, detail } = repository
    ? splitDescription(repository.description)
    : { tagline: "", detail: "" };
  const builtWith = repository ? visibleLanguages(repository) : [];

  return (
    <Section id={id} aria-labelledby="colophon-title">
      <Meta>
        <Index>
          <Dot aria-hidden="true" />
          {t("colophon.eyebrow")}
        </Index>
        {builtWith.length > 0 && (
          <Languages>
            {builtWith.map((language) => (
              <span key={language}>{language}</span>
            ))}
          </Languages>
        )}
      </Meta>
      <Title id="colophon-title">{t("colophon.title")}</Title>
      {tagline && <Lead>{tagline}</Lead>}
      {detail && <Detail>{detail}</Detail>}
      <Links>
        <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
          {t("colophon.sourceLabel")}
        </a>
      </Links>
    </Section>
  );
};
