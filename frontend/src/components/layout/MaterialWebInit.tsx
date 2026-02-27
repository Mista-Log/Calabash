"use client";

import { useEffect, useRef } from "react";
import { ensureMaterialWebRegistered } from "@/lib/material-web";

export function MaterialWebInit() {
  const warned = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const register = async () => {
      for (let attempt = 0; attempt < 2 && !cancelled; attempt += 1) {
        try {
          await ensureMaterialWebRegistered();
          return;
        } catch (error) {
          if (attempt === 1 && !warned.current) {
            warned.current = true;
            console.warn(
              "Material Web registration failed after retry.",
              error
            );
          }
        }
      }
    };

    void register();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
