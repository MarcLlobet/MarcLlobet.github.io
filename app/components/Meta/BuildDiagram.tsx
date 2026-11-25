"use client";

import { Fragment } from "react";
import { Mockup } from "../Mockup";
import { useCopy, type CopyKey } from "../../utils/copy";
import { buildPipelineIcon, type PipelineKind } from "./pipelineShapes";
import {
  Connector,
  Figure,
  Frame,
  NodeLabel,
  Track,
  VisuallyHidden,
} from "./BuildDiagram.styles";

/*
 * Four steps, each a small drawing in pipelineShapes.ts rather than a
 * project's own mockup kind — see there for why: it buys the exact label
 * this pipeline needs (the API call, the checks gating it, pre-rendering
 * to static HTML, the deploy) instead of bending a generic kind's meaning
 * to fit, while still sharing that same file's conventions (window chrome,
 * Tone palette, one accent highlight) so nothing here looks like a
 * different drawing than the one next to it.
 */
const NODES: { id: PipelineKind; labelKey: CopyKey; descKey: CopyKey }[] = [
  {
    id: "api",
    labelKey: "metaSection.diagram.api.label",
    descKey: "metaSection.diagram.api.desc",
  },
  {
    id: "checks",
    labelKey: "metaSection.diagram.checks.label",
    descKey: "metaSection.diagram.checks.desc",
  },
  {
    id: "ssg",
    labelKey: "metaSection.diagram.ssg.label",
    descKey: "metaSection.diagram.ssg.desc",
  },
  {
    id: "deploy",
    labelKey: "metaSection.diagram.deploy.label",
    descKey: "metaSection.diagram.deploy.desc",
  },
];

/** The repo's own build-and-serve pipeline, drawn with the same mockup
 * shapes, colours and animations as every project preview: the GitHub API
 * feeding checks, pre-rendered to static HTML, and deployed. Frame, label
 * and connector are all placed on one grid by their fixed DOM position (see
 * BuildDiagram.styles' Track), so a connector always lands centered on the
 * box it sits between, rather than centered across the wider row that also
 * includes the label. */
export const BuildDiagram = () => {
  const { t } = useCopy();

  return (
    <Figure>
      <VisuallyHidden>
        {NODES.map((n) => (
          <li key={n.id}>
            {t(n.labelKey)}: {t(n.descKey)}
          </li>
        ))}
      </VisuallyHidden>
      <Track aria-hidden="true">
        {NODES.map((n, i) => (
          <Fragment key={n.id}>
            <Frame data-play="always">
              <Mockup build={(w, h) => buildPipelineIcon(n.id, w, h)} />
            </Frame>
            <NodeLabel>{t(n.labelKey)}</NodeLabel>
            {i < NODES.length - 1 && <Connector />}
          </Fragment>
        ))}
      </Track>
    </Figure>
  );
};
