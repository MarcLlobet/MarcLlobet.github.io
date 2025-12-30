import { useRef, forwardRef, useImperativeHandle } from "react";
import styled from "styled-components";

type MorphShapeProps = {
  size?: "small" | "big";
  isMorphed?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  stroke?: string;
  fill?: string;
  infiniteAnimation?: boolean;
  onMorph?: () => void;
  onReset?: () => void;
};

const strokeWidthBySize = {
  small: 6,
  big: 1,
};

function getPolygonPoints(
  cx: number,
  cy: number,
  r: number,
  sides: number,
  offsetAngle = 0,
): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i < sides; i++) {
    const angle = ((2 * Math.PI) / sides) * i + offsetAngle;
    points.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  return points;
}

function pointsToPath(points: [number, number][]) {
  return (
    `M${points[0][0]},${points[0][1]} ` +
    points
      .slice(1)
      .map(([x, y]) => `L${x},${y}`)
      .join(" ") +
    " Z"
  );
}

const NUM_POINTS = 60;
const cx = 50,
  cy = 50,
  r = 40;

const triangleVertices = getPolygonPoints(cx, cy, r, 3, -Math.PI / 2);
const trianglePoints: [number, number][] = [];
for (let i = 0; i < 3; i++) {
  const p1 = triangleVertices[i];
  const p2 = triangleVertices[(i + 1) % 3];
  for (let j = 0; j < NUM_POINTS / 3; j++) {
    const t = j / (NUM_POINTS / 3);
    trianglePoints.push([
      p1[0] + (p2[0] - p1[0]) * t,
      p1[1] + (p2[1] - p1[1]) * t,
    ]);
  }
}
const TRIANGLE_PATH = pointsToPath(trianglePoints);

const circlePoints = getPolygonPoints(cx, cy, r, NUM_POINTS);
const CIRCLE_PATH = pointsToPath(circlePoints);

const StyledMorphShape = styled.svg<{ $isSmall: boolean }>`
  display: inline-block;
  transform: rotate(90deg);
  inline-size: ${({ $isSmall }) => ($isSmall ? 20 : 150)}px;
  block-size: ${({ $isSmall }) => ($isSmall ? 20 : 150)}px;

  @media (max-width: 600px) {
    inline-size: ${({ $isSmall }) => ($isSmall ? 30 : 100)}px;
    block-size: ${({ $isSmall }) => ($isSmall ? 30 : 100)}px;
  }
`;

export const MorphShape = forwardRef<
  { morph: () => void; reset: () => void },
  MorphShapeProps
>(
  (
    {
      size = "small",
      stroke = "currentColor",
      fill = "none",
      infiniteAnimation = false,
      onMorph,
      onReset,
      ...rest
    },
    ref,
  ) => {
    const morphRef = useRef<SVGAnimateElement>(null);
    const resetRef = useRef<SVGAnimateElement>(null);

    useImperativeHandle(ref, () => ({
      morph: () => {
        if (morphRef.current) {
          onMorph?.();
          morphRef.current.beginElement?.();
        }
      },
      reset: () => {
        if (resetRef.current) {
          onReset?.();
          resetRef.current.beginElement?.();
        }
      },
    }));

    return (
      <StyledMorphShape
        aria-label="Morphing shape"
        $isSmall={size === "small"}
        viewBox="0 0 100 100"
        {...rest}
      >
        <path
          d={CIRCLE_PATH}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidthBySize[size]}
        >
          {infiniteAnimation ? (
            <animate
              attributeName="d"
              values={`${CIRCLE_PATH};${TRIANGLE_PATH};${TRIANGLE_PATH};${CIRCLE_PATH};${CIRCLE_PATH}`}
              keyTimes="0;0.1;0.5;0.6;1"
              dur="6s"
              fill="freeze"
              repeatCount="indefinite"
            />
          ) : (
            <>
              <animate
                ref={morphRef}
                attributeName="d"
                from={CIRCLE_PATH}
                to={TRIANGLE_PATH}
                dur="0.5s"
                fill="freeze"
                begin="indefinite"
              />
              <animate
                ref={resetRef}
                attributeName="d"
                from={TRIANGLE_PATH}
                to={CIRCLE_PATH}
                dur="0.5s"
                fill="freeze"
                begin="indefinite"
              />
            </>
          )}
        </path>
      </StyledMorphShape>
    );
  },
);
