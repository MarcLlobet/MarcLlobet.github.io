"use client";

import { useEffect, useRef } from "react";
import styled from "styled-components";
import { Mockup } from "../Mockup";
import type { MockupKind } from "../../mockups";
import { displayName } from "../../utils/projects";
import type { Repository } from "../../types";

export type DemoViewerProps = {
  repository: Repository;
  accent: string;
  kind: MockupKind;
  onClose: () => void;
};

const Dialog = styled.div<{ $accent: string }>`
  --c: ${({ $accent }) => $accent};
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-block: calc(1rem + env(safe-area-inset-top, 0px))
    calc(1rem + env(safe-area-inset-bottom, 0px));
  padding-inline: max(1rem, env(safe-area-inset-left, 0px))
    max(1rem, env(safe-area-inset-right, 0px));
  background: var(--color-bg);
`;

const Bar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  font-family: var(--mono-stack);
  font-size: 0.8125rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text);
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  a {
    display: inline-flex;
    align-items: center;
    min-block-size: var(--tap-target);
    color: var(--color-text);
    border-block-end: 2px solid var(--c);
  }

  button {
    min-block-size: var(--tap-target);
    padding-inline: 1rem;
    font: inherit;
    text-transform: inherit;
    color: var(--color-text);
    background: none;
    border: 1px solid var(--color-line-strong);
    cursor: pointer;
  }
`;

/* data-play="always": the mockup plays its loop as if the demo were running */
const Screen = styled.div`
  position: relative;
  flex: 1;
  min-block-size: 0;
  background: var(--color-surface);
  view-transition-name: demo-shot;
`;

const Note = styled.p`
  max-inline-size: 70ch;
  color: var(--color-muted);
`;

/**
 * The project expanded to full screen. The page opens it inside a View
 * Transition, so the preview grows into it. On the live site this is where the
 * transition into the real demo happens (a cross-document View Transition).
 */
export const DemoViewer = ({
  repository,
  accent,
  kind,
  onClose,
}: DemoViewerProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const name = displayName(repository.name);

  useEffect(() => {
    closeRef.current?.focus();
    const html = document.documentElement;
    const overflow = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const focusable = [
        ...(dialogRef.current?.querySelectorAll<HTMLElement>("a, button") ??
          []),
      ];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      html.style.overflow = overflow;
    };
  }, [onClose]);

  return (
    <Dialog
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-viewer-title"
      $accent={accent}
    >
      <Bar>
        <span id="demo-viewer-title">{name}</span>
        <Actions>
          <a
            href={repository.homepageUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open the demo ↗
          </a>
          <button ref={closeRef} type="button" onClick={onClose}>
            Close
          </button>
        </Actions>
      </Bar>
      <Screen data-play="always">
        <Mockup kind={kind} />
      </Screen>
      <Note>
        Preview of the transition. On the live site the frame grows into the
        real demo, with a cross-document View Transition.
      </Note>
    </Dialog>
  );
};
