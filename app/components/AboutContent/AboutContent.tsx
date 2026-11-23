"use client";

import { accentFor } from "../../utils/projects";
import {
  Layout,
  TextColumn,
  Bio as BioText,
  Placeholder,
  ContactRow,
  TextureSlot,
  Grid,
  Cell,
  Caption,
} from "./AboutContent.styles";
import type { Repository } from "../../types";

export type AboutContentProps = {
  bio: string;
  repositories: Repository[];
  githubUrl: string;
};

/** The bio, the repo-texture grid, and the contact links — the part of About that's the same whether it opens as a modal or stands alone as a page. */
export const AboutContent = ({
  bio,
  repositories,
  githubUrl,
}: AboutContentProps) => (
  <Layout>
    <TextColumn>
      <BioText>{bio}</BioText>
      <Placeholder>
        The few sentences on how I think about this work go here.
      </Placeholder>
      <ContactRow>
        <a href={githubUrl} target="_blank" rel="noopener noreferrer">
          GitHub ↗
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
        <Caption>({repositories.length}) repos</Caption>
      </TextureSlot>
    )}
  </Layout>
);
