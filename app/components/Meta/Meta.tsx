"use client";

import { useCopy } from "../../utils/copy";
import { REPO_URL } from "../../constants";
import { splitDescription } from "../../utils/projects";
import type { SiteRepository } from "../../types";
import {
  Detail,
  Dot,
  Header,
  Index,
  Lead,
  Links,
  Section,
  Title,
} from "./Meta.styles";

export type MetaProps = {
  id: string;
  /** This repo's own description and languages, straight from GitHub. */
  repository: SiteRepository | null;
};

/** A closing note, not a second front door: how the site itself is made. */
export const Meta = ({ id, repository }: MetaProps) => {
  const { t } = useCopy();
  const { tagline, detail } = repository
    ? splitDescription(repository.description)
    : { tagline: "", detail: "" };

  return (
    <Section id={id} aria-labelledby="meta-title">
      <Header>
        <Index>
          <Dot aria-hidden="true" />
          {t("metaSection.eyebrow")}
        </Index>
        <span>{t("metaSection.detail")}</span>
      </Header>
      <Title id="meta-title">{t("metaSection.title")}</Title>
      {tagline && <Lead>{tagline}</Lead>}
      {detail && <Detail>{detail}</Detail>}
      <Links>
        <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
          {t("metaSection.sourceLabel")}
        </a>
      </Links>
    </Section>
  );
};
