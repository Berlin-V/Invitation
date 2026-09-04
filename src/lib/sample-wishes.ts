import type { Wish } from "@/types";
import { COUPLE } from "@/constants";

const DAY_MS = 86_400_000;

/**
 * Stand-in wishes served when Firebase isn't configured, so both the public
 * wall and the admin screen can still be exercised locally. The two routes
 * each carried their own copy of this list.
 */
export function sampleWishes(): Wish[] {
  return [
    {
      id: "sample1",
      name: "Sarah & James",
      relation: "Friend of the Couple",
      message: `Wishing you both a lifetime of love and happiness! May your journey together be filled with joy, laughter, and endless blessings. Congratulations ${COUPLE.groom} and ${COUPLE.bride}! 🎉`,
      createdAt: new Date(Date.now() - DAY_MS).toISOString(),
      deleted: false,
    },
    {
      id: "sample2",
      name: "Aunt Priya",
      relation: "Family",
      message: "So happy for you both — wishing you a lifetime of love!",
      createdAt: new Date(Date.now() - 2 * DAY_MS).toISOString(),
      deleted: false,
    },
  ];
}
