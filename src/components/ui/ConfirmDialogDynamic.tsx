"use client";

import dynamic from "next/dynamic";
import type ConfirmDialog from "./ConfirmDialog";
import type { ComponentProps } from "react";

/**
 * Lazy code-split wrapper around ConfirmDialog.
 * Loaded only when a critical confirmation action is triggered.
 */
const ConfirmDialogDynamic = dynamic<ComponentProps<typeof ConfirmDialog>>(
  () => import("./ConfirmDialog"),
  {
    ssr: false,
  }
);

export default ConfirmDialogDynamic;
