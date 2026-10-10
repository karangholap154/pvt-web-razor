"use client";

import dynamic from "next/dynamic";
import type AskQuestionModal from "./AskQuestionModal";
import type { ComponentProps } from "react";

/**
 * Lazy code-split wrapper around AskQuestionModal.
 * Code-splits discussion authoring UI until the user clicks "+ Ask Question".
 */
const AskQuestionModalDynamic = dynamic<ComponentProps<typeof AskQuestionModal>>(
  () => import("./AskQuestionModal"),
  {
    ssr: false,
  }
);

export default AskQuestionModalDynamic;
