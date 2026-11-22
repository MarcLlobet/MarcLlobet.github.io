"use client";

import { useRouter } from "next/navigation";
import { BioPortal } from "../BioPortal";
import type { Repository } from "../../types";

export type AboutRouteProps = {
  bio: string;
  repositories: Repository[];
  githubUrl: string;
};

/** Wires BioPortal's onClose to a real navigation back to the home page. */
export const AboutRoute = (props: AboutRouteProps) => {
  const router = useRouter();
  return <BioPortal {...props} onClose={() => router.push("/")} />;
};
