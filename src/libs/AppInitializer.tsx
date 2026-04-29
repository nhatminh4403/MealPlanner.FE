"use client";

import { useEffect } from "react";
import { syncMockModeFromServer } from "./axios";

export default function AppInitializer() {
   useEffect(() => {
    syncMockModeFromServer();
  }, []);

  return null;
}
