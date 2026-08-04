import Image from "next/image";
import type { Metadata } from "next";
import styles from "./page.module.css";
import { LINK_ITEMS } from "@/lib/data/links";

export const metadata: Metadata = {
  title: "Movi Body — Links",
};

export default function LinksPage() {
  return (
    <div className={styles.page}>
      <Image className={styles.logo} src="/logo.png" alt="Movi Body" width={100} height={100} />
      <p className={styles.tagline}>The Movement Builds a New Identity.</p>

      <div className={styles.links}>
        {LINK_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`${styles.card}${item.featured ? ` ${styles.featured}` : ""}`}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            <span>{item.label}</span>
            <span className={styles.arrow}>→</span>
          </a>
        ))}
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerText}>
          MOVI BODY — ® 2026
          <br />
          ALL RIGHTS RESERVED
        </div>
      </footer>
    </div>
  );
}
