"use client";

import dynamic from "next/dynamic";
import type AdminResourceModal from "./AdminResourceModal";
import type { ComponentProps } from "react";

/**
 * Lazy code-split wrapper around AdminResourceModal.
 * Only downloaded when the superuser opens create or edit dialogs.
 */
const AdminResourceModalDynamic = dynamic<ComponentProps<typeof AdminResourceModal>>(
  () => import("./AdminResourceModal"),
  {
    ssr: false,
  }
);

export default AdminResourceModalDynamic;
