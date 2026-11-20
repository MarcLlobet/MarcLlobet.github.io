"use client";

import { useEffect, useRef, useState } from "react";
import { Mockup } from "../Mockup";
import type { MockupKind } from "../../mockups";
import {
  displayName,
  splitDescription,
  visibleLanguages,
} from "../../utils/projects";
import { RICH_POINTER, useMediaQuery } from "../../utils/useMediaQuery";
import type { Repository } from "../../types";
import {
  Float,
  FloatCaption,
  FloatFrame,
  FloatShot,
  Head,
  List,
  RowNumber,
  Row,
  RowLanguages,
  RowName,
  RowTagline,
  Section,
  Title,
} from "./ArchiveIndex.styles";

export type ArchiveItem = {
  repository: Repository;
  accent: string;
  kind: MockupKind;
};

export type ArchiveIndexProps = {
  items: ArchiveItem[];
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Preview that follows the pointer and ripples when it changes project. */
const FloatingPreview = ({ item }: { item: ArchiveItem | null }) => {
  const floatRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<SVGFEDisplacementMapElement>(null);
  const rippleStart = useRef(0);
  const [shown, setShown] = useState<ArchiveItem | null>(item);
  if (item && item !== shown) setShown(item);

  useEffect(() => {
    rippleStart.current = performance.now();
  }, [shown]);

  useEffect(() => {
    const pointer = { x: -400, y: -400 };
    const position = { x: -400, y: -400 };
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    const tick = (now: number) => {
      const float = floatRef.current;
      if (float) {
        const width = float.offsetWidth;
        const targetX = Math.min(
          pointer.x + 32,
          window.innerWidth - width - 16,
        );
        const targetY = Math.min(
          pointer.y - 40,
          window.innerHeight - float.offsetHeight - 16,
        );
        position.x += (targetX - position.x) * 0.12;
        position.y += (targetY - position.y) * 0.12;
        float.style.transform = `translate3d(${position.x.toFixed(1)}px, ${Math.max(16, position.y).toFixed(1)}px, 0)`;
      }
      const k = Math.min(1, (now - rippleStart.current) / 600);
      rippleRef.current?.setAttribute(
        "scale",
        ((1 - k) * (1 - k) * 70).toFixed(1),
      );
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  const visible = item !== null;
  return (
    <Float
      ref={floatRef}
      dir="ltr"
      aria-hidden="true"
      $visible={visible}
      $accent={shown?.accent ?? "transparent"}
    >
      <svg width="0" height="0" focusable="false">
        <filter
          id="archive-ripple"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.05"
            numOctaves={2}
            seed={4}
            result="noise"
          />
          <feDisplacementMap
            ref={rippleRef}
            in="SourceGraphic"
            in2="noise"
            scale={0}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <FloatFrame $visible={visible}>
        {shown && (
          <FloatShot>
            <Mockup kind={shown.kind} />
          </FloatShot>
        )}
      </FloatFrame>
      <FloatCaption>
        {shown ? splitDescription(shown.repository.description).tagline : ""}
      </FloatCaption>
    </Float>
  );
};

export const ArchiveIndex = ({ items }: ArchiveIndexProps) => {
  const richPointer = useMediaQuery(RICH_POINTER);
  const [active, setActive] = useState<number | null>(null);

  return (
    <Section id="archive" aria-labelledby="archive-title">
      <Head>
        <span>Other experiments</span>
        <span>({pad(items.length)}) · Tagged “demo”</span>
      </Head>
      <Title id="archive-title">Archive</Title>
      <List onPointerLeave={() => setActive(null)}>
        {items.map(({ repository }, index) => (
          <li key={repository.id}>
            <Row
              href={repository.url}
              target="_blank"
              rel="noopener noreferrer"
              onPointerEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onBlur={() => setActive(null)}
            >
              <RowNumber>{pad(index + 1)}</RowNumber>
              <RowName>{displayName(repository.name)}</RowName>
              <RowLanguages>
                {visibleLanguages(repository).slice(0, 3).join(" · ")}
              </RowLanguages>
              <RowTagline>
                {splitDescription(repository.description).tagline}
              </RowTagline>
            </Row>
          </li>
        ))}
      </List>
      {richPointer && (
        <FloatingPreview item={active === null ? null : items[active]} />
      )}
    </Section>
  );
};
