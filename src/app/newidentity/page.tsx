import type { Metadata } from "next";
import styles from "./page.module.css";
import { VslPlayer } from "@/components/VslPlayer";

export const metadata: Metadata = {
  title: "New Identity — Movi Body",
};

export default function NewIdentityPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.playerFrame}>
          <VslPlayer />
        </div>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerText}>
          NEW IDENTITY — ® 2026
          <br />
          ALL RIGHTS RESERVED
        </div>
      </footer>
    </div>
  );
}
