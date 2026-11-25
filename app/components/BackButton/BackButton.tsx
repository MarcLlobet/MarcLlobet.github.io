"use client";

import { useRouter } from "next/navigation";
import { requestPageExit } from "../../utils/pageTransition";
import { prepareReturn } from "../../utils/returnNav";
import { useCopy } from "../../utils/copy";
import { Button } from "./BackButton.styles";

/**
 * Returns to the home page, at the exact scroll position the project was
 * opened from — rememberScroll (called where a project link is clicked)
 * is what makes that position available here. Collapses the current
 * page's reveal back into whatever it grew in from (requestPageExit)
 * before actually navigating, so leaving plays the same transition as
 * arriving, in reverse.
 *
 * Always router.push("/"), never router.back(): the history entry
 * back() would land on still carries whatever #section hash was last
 * recorded there, and Next's own hash-scroll-on-navigate would then
 * smoothly override useRestoreScroll's precise, instant restore a few
 * hundred ms later. push() lands on a clean "/" with nothing to fight
 * over — and { scroll: false } turns off Next's OWN default of
 * scrolling every push to the top, which otherwise races
 * useRestoreScroll's own scrollTo and wins unpredictably, since this is
 * exactly the scroll position useRestoreScroll already owns.
 */
export const BackButton = () => {
  const router = useRouter();
  const { t } = useCopy();

  const onClick = async () => {
    prepareReturn();
    await requestPageExit();
    router.push("/", { scroll: false });
  };

  return (
    <Button type="button" onClick={onClick}>
      {t("projectContent.backLabel")}
    </Button>
  );
};
