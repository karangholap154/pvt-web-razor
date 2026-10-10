"use client";

import dynamic from "next/dynamic";
import type AdminReviewModal from "./AdminReviewModal";
import type { ComponentProps } from "react";

/**
 * Lazy code-split wrapper around AdminReviewModal.
 * Loaded only when a pending student submission review modal is opened.
 */
const AdminReviewModalDynamic = dynamic<ComponentProps<typeof AdminReviewModal>>(
  () => import("./AdminReviewModal"),
  {
    ssr: false,
  }
);

export default AdminReviewModalDynamic;
