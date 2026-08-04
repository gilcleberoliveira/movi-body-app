"use client";

import { useEffect, useRef } from "react";
import styles from "@/app/newidentity/page.module.css";
import { VTURB_PLAYER_ID, VTURB_SCRIPT_SRC } from "@/lib/data/vsl";

export function VslPlayer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!VTURB_PLAYER_ID || !containerRef.current) return;

    const player = document.createElement("vturb-smartplayer");
    player.id = VTURB_PLAYER_ID;
    player.setAttribute("style", "display: block; margin: 0 auto; width: 100%;");
    containerRef.current.appendChild(player);

    let script: HTMLScriptElement | null = null;
    if (VTURB_SCRIPT_SRC) {
      script = document.createElement("script");
      script.src = VTURB_SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      player.remove();
      script?.remove();
    };
  }, []);

  if (!VTURB_PLAYER_ID) {
    return (
      <div className={styles.placeholder}>
        <p>Video coming soon</p>
      </div>
    );
  }

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
