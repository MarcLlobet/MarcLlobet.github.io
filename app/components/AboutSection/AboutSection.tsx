"use client";

import { accentFor, splitDescription } from "../../utils/projects";
import { SCENE } from "../ScrollScene/scene-ids";
import copy from "../../content/copy.json";
import type { Repository } from "../../types";
import {
  Caption,
  Cell,
  ContactRow,
  Detail,
  Eyebrow,
  Grid,
  Layout,
  Section,
  Tagline,
  TextColumn,
  TextureSlot,
} from "./AboutSection.styles";

export type AboutSectionProps = {
  bio: string;
  repositories: Repository[];
  githubUrl: string;
};

/** A full-height moment between the Hero and the work: the bio in full, and a texture of every repository. */
export const AboutSection = ({
  bio,
  repositories,
  githubUrl,
}: AboutSectionProps) => {
  const { tagline, detail } = splitDescription(bio);
  return (
    <Section id={SCENE.about} aria-label={copy.about.heading}>
      <Eyebrow>{copy.about.heading}</Eyebrow>
      <Layout>
        <TextColumn>
          <Tagline>{tagline}</Tagline>
          {detail && <Detail>{detail}</Detail>}
          <ContactRow>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer">
              {copy.about.githubLabel}
            </a>
          </ContactRow>
        </TextColumn>
        {repositories.length > 0 && (
          <TextureSlot>
            <Grid aria-hidden="true">
              {repositories.map((repository, index) => (
                <Cell key={repository.id} $accent={accentFor(index)} />
              ))}
            </Grid>
            <Caption>
              ({repositories.length}) {copy.about.repoCountSuffix}
            </Caption>
          </TextureSlot>
        )}
      </Layout>
    </Section>
  );
};
