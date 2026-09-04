import { COUPLE } from "@/constants";
import type { WishSide } from "@/types";

/**
 * Wishes store one composed `relation` string (e.g. "Berlin's College Mate").
 * Composition and parsing both live here on purpose: they used to sit in
 * separate files and had drifted out of step — the form wrote "Berlin's …"
 * while the readers tested for a literal "Groom's …", so every wish came back
 * classified as "both" and the per-side leaf colours never appeared.
 */

/** Prefix written for a one-sided wish, e.g. "Berlin's ". */
const SIDE_PREFIX: Record<Exclude<WishSide, "both">, string> = {
  groom: `${COUPLE.groom}'s `,
  bride: `${COUPLE.bride}'s `,
};

/** Suffix written for a wish addressed to the pair. */
const BOTH_SUFFIX = ` of ${COUPLE.groom} & ${COUPLE.bride}`;

/**
 * Older prefixes still present on wishes already in the database, kept so
 * historical rows keep classifying correctly.
 */
const LEGACY_SIDE_PREFIX: Record<Exclude<WishSide, "both">, string[]> = {
  groom: ["Groom's "],
  bride: ["Bride's "],
};

const LEGACY_BOTH_SUFFIXES = [" of the Couple"];

/** Builds the stored `relation` string from the two picker selections. */
export function composeRelation(side: WishSide, typeLabel: string): string {
  if (side === "both") return `${typeLabel}${BOTH_SUFFIX}`;
  return `${SIDE_PREFIX[side]}${typeLabel}`;
}

function matchedSidePrefix(relation: string): { side: WishSide; prefix: string } | null {
  for (const side of ["groom", "bride"] as const) {
    for (const prefix of [SIDE_PREFIX[side], ...LEGACY_SIDE_PREFIX[side]]) {
      if (relation.startsWith(prefix)) return { side, prefix };
    }
  }
  return null;
}

/** Which side of the family a wish came from. */
export function wishSide(relation: string): WishSide {
  return matchedSidePrefix(relation)?.side ?? "both";
}

const SIDE_LABELS: Record<WishSide, string> = {
  groom: "Groom",
  bride: "Bride",
  both: "Groom & Bride",
};

export function wishSideLabel(relation: string): string {
  return SIDE_LABELS[wishSide(relation)];
}

/** The relationship on its own, with the side prefix or pair suffix stripped. */
export function wishRelationshipLabel(relation: string): string {
  const matched = matchedSidePrefix(relation);
  if (matched) return relation.slice(matched.prefix.length);

  for (const suffix of [BOTH_SUFFIX, ...LEGACY_BOTH_SUFFIXES]) {
    if (relation.endsWith(suffix)) return relation.slice(0, -suffix.length);
  }
  return relation;
}
