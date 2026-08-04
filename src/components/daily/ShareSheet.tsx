"use client";

import { useState } from "react";
import { ShareIcon, ChatBubbleIcon, MailIcon, ClipboardIcon } from "@/components/icons";

export function ShareSheet({
  open,
  onClose,
  text,
  onShared,
}: {
  open: boolean;
  onClose: () => void;
  text: string;
  onShared: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const canNativeShare = typeof navigator !== "undefined" && "share" in navigator;

  async function handleNativeShare() {
    try {
      await navigator.share({ text });
      onShared();
      onClose();
    } catch {
      // user cancelled the native share sheet — no-op
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onShared();
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  function handleLinkShare() {
    onShared();
  }

  return (
    <div className={`overlay${open ? " open" : ""}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sheet-head">
          <h3>Share this message</h3>
          <button aria-label="Close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="share-list">
          {canNativeShare && (
            <button className="share-row" onClick={handleNativeShare}>
              <span className="icon-badge">
                <ShareIcon />
              </span>
              <span className="label">Share via…</span>
            </button>
          )}
          <a
            className="share-row"
            href={`https://wa.me/?text=${encodeURIComponent(text)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkShare}
          >
            <span className="icon-badge">
              <ChatBubbleIcon />
            </span>
            <span className="label">WhatsApp</span>
          </a>
          <a
            className="share-row"
            href={`mailto:?body=${encodeURIComponent(text)}`}
            onClick={handleLinkShare}
          >
            <span className="icon-badge">
              <MailIcon />
            </span>
            <span className="label">Email</span>
          </a>
          <button className="share-row" onClick={handleCopy}>
            <span className="icon-badge">
              <ClipboardIcon />
            </span>
            <span className="label">{copied ? "Copied!" : "Copy phrase"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
