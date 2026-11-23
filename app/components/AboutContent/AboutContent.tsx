"use client";

import { accentFor } from "../../utils/projects";
import {
  Title,
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

/** The whole /about page: a title, the bio, the repo-texture grid, and the contact links. */
export const AboutContent = ({
  bio,
  repositories,
  githubUrl,
}: AboutContentProps) => (
  <>
    <Title>About</Title>
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
  </>
);
