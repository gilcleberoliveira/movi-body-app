"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { AttachIcon, SendIcon } from "@/components/icons";
import { sendChatMessage } from "@/app/actions";

export type ChatMessage = {
  id: string;
  user_id: string;
  name: string;
  initial: string;
  kind: "text" | "media";
  body: string | null;
  storage_path: string | null;
  created_at: string;
};

function hoursLeft(createdAt: string) {
  const elapsedMs = Date.now() - new Date(createdAt).getTime();
  const left = 24 - elapsedMs / 3_600_000;
  return Math.max(0, Math.round(left));
}

export function ChatRoom({ userId, initialMessages }: { userId: string; initialMessages: ChatMessage[] }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [text, setText] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("chat_messages_room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          setMessages((prev) => {
            const row = payload.new as ChatMessage;
            if (prev.some((m) => m.id === row.id)) return prev;
            return [...prev, row];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [messages]);

  async function handleSend() {
    if (sending) return;
    if (!pendingFile && !text.trim()) return;
    setSending(true);
    const formData = new FormData();
    if (text.trim()) formData.set("body", text.trim());
    if (pendingFile) formData.set("file", pendingFile);
    try {
      await sendChatMessage(formData);
      setText("");
      setPendingFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setSending(false);
    }
  }

  function mediaUrl(path: string | null) {
    if (!path) return null;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${path}`;
  }

  return (
    <>
      <div className="chat-thread" ref={threadRef}>
        {messages.map((m) => {
          const own = m.user_id === userId;
          return (
            <div key={m.id} className={`chat-row${own ? " own" : ""}`}>
              <div className="chat-avatar">{m.initial}</div>
              <div className="chat-bubble-wrap">
                {!own && <p className="chat-name">{m.name}</p>}
                {m.kind === "media" ? (
                  <div className="chat-bubble media">
                    <div className="chat-media-box">
                      {mediaUrl(m.storage_path) && (
                        <Image src={mediaUrl(m.storage_path)!} alt="" width={180} height={135} unoptimized />
                      )}
                    </div>
                    {m.body && <p className="chat-media-caption">{m.body}</p>}
                  </div>
                ) : (
                  <div className="chat-bubble">{m.body}</div>
                )}
                <div className="chat-meta">{hoursLeft(m.created_at)}h left</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="chat-inputbar">
        <button
          className={`chat-attach-btn${pendingFile ? " active" : ""}`}
          aria-label="Attach photo or video"
          onClick={() => fileInputRef.current?.click()}
        >
          <AttachIcon />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          style={{ display: "none" }}
          onChange={(e) => setPendingFile(e.target.files?.[0] ?? null)}
        />
        <input
          className="chat-input"
          type="text"
          placeholder={pendingFile ? "Add a caption (optional)…" : "Message the group…"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="chat-send-btn" aria-label="Send" onClick={handleSend} disabled={sending}>
          <SendIcon />
        </button>
      </div>
    </>
  );
}
