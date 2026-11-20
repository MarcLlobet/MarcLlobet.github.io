"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { buildMockup, type MockupKind, type Shape } from "../../mockups";
import { MockupBox, MockupSvg } from "./Mockup.styles";

export type MockupProps = {
  kind: MockupKind;
};

const round = (value: number) => Math.round(value * 100) / 100;

const motionProps = (shape: Shape) => {
  if (shape.type === "path") return {};
  const classes = [
    shape.order !== undefined && "build",
    shape.loop && `loop-${shape.loop}`,
  ].filter(Boolean);
  return {
    classes: classes.join(" "),
    style:
      shape.order !== undefined
        ? ({ "--i": round(shape.order) } as CSSProperties)
        : undefined,
  };
};

const renderShape = (shape: Shape, index: number) => {
  if (shape.type === "path") {
    return (
      <path
        key={index}
        d={shape.d}
        className={`stroke-${shape.stroke}${shape.draw ? " draw" : ""}`}
        strokeWidth={round(shape.strokeWidth)}
        strokeOpacity={shape.opacity}
        pathLength={1}
      />
    );
  }
  const { classes, style } = motionProps(shape);
  if (shape.type === "circle") {
    return (
      <circle
        key={index}
        cx={round(shape.cx)}
        cy={round(shape.cy)}
        r={round(shape.r)}
        className={`fill-${shape.fill} ${classes}`}
        fillOpacity={shape.opacity && round(shape.opacity)}
        style={style}
      />
    );
  }
  const tone = shape.fill ? `fill-${shape.fill}` : `stroke-${shape.stroke}`;
  return (
    <rect
      key={index}
      x={round(shape.x)}
      y={round(shape.y)}
      width={round(shape.w)}
      height={round(shape.h)}
      rx={shape.rx && round(shape.rx)}
      className={`${tone} ${classes}`}
      fillOpacity={shape.opacity && round(shape.opacity)}
      strokeWidth={shape.strokeWidth && round(shape.strokeWidth)}
      style={style}
    />
  );
};

/**
 * A project mockup drawn at the exact pixel size of its box, redrawn whenever
 * the box changes size: the layout reflows instead of scaling or cropping.
 * It fills its nearest positioned ancestor.
 */
export const Mockup = ({ kind }: MockupProps) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const box = boxRef.current;
    if (!box || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width);
      const height = Math.round(entry.contentRect.height);
      setSize((current) =>
        current.width === width && current.height === height
          ? current
          : { width, height },
      );
    });
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  const shapes = useMemo(
    () =>
      size.width > 1 && size.height > 1
        ? buildMockup(kind, size.width, size.height)
        : [],
    [kind, size.width, size.height],
  );

  return (
    <MockupBox ref={boxRef} aria-hidden="true">
      {shapes.length > 0 && (
        <MockupSvg
          viewBox={`0 0 ${size.width} ${size.height}`}
          width={size.width}
          height={size.height}
          focusable="false"
        >
          {shapes.map(renderShape)}
        </MockupSvg>
      )}
    </MockupBox>
  );
};
