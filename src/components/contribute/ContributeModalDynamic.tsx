import dynamic from "next/dynamic";
import type ContributeModal from "./ContributeModal";
import type { ComponentProps } from "react";

/**
 * Lazy client-only wrapper around ContributeModal.
 * Code-splits the upload modal JS bundle so it is loaded on-demand.
 */
const ContributeModalDynamic = dynamic<ComponentProps<typeof ContributeModal>>(
  () => import("./ContributeModal"),
  {
    ssr: false,
  }
);

export default ContributeModalDynamic;
