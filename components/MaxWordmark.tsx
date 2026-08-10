import { MAX_PATHS, MAX_VIEWBOX } from "./wordmark-paths";

/*
 * The FOR SEE line is set as live text in the logo's own typeface rather than
 * traced, so it stays razor sharp at any size. Every number below is measured
 * off the original artwork, in the same coordinate space as the MAX letters:
 * the ink of each word is pinned to the exact box it occupies in the logo.
 *
 * textLength drives the tracking, so the words keep the logo's spacing even if
 * the font has not arrived yet and a fallback is standing in.
 */
const FOR_SEE_BASELINE = 162;
const FOR_SEE_SIZE = 26.43; // cap height 19, Raleway caps are 0.71875em
// Starts under the right leg of the A, nudged further toward the X.
// −2% of the wordmark width (592) → ~12 units left.
const FOR_SEE_WORDS = [
  { text: "FOR", x: 425, length: 63.9 },
  { text: "SEE", x: 507.5, length: 61 },
];

type Props = {
  className?: string;
  /** Overrides the colour of the small FOR SEE line, which otherwise inherits. */
  forSeeClassName?: string;
};

/** The brand logo as vector art, traced from the original artwork. */
export function MaxWordmark({ className, forSeeClassName }: Props) {
  return (
    <svg
      viewBox={MAX_VIEWBOX}
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path d={MAX_PATHS.m} />
      <path d={MAX_PATHS.a} />
      <path d={MAX_PATHS.x} />

      <g
        className={forSeeClassName}
        fontFamily="Raleway, sans-serif"
        fontWeight={700}
        fontSize={FOR_SEE_SIZE}
      >
        {FOR_SEE_WORDS.map((word) => (
          <text
            key={word.text}
            x={word.x}
            y={FOR_SEE_BASELINE}
            textLength={word.length}
            lengthAdjust="spacing"
          >
            {word.text}
          </text>
        ))}
      </g>
    </svg>
  );
}
