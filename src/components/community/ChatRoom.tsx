"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { AttachIcon, SendIcon } from "@/components/icons";
import { sendChatMessage } from "@/app/actions";
import { uploadMediaFromBrowser } from "@/lib/uploadMedia";
import { markChatRead } from "@/lib/chatRead";

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

export function ChatRoom({
  userId,
  userName,
  userInitial,
  initialMessages,
}: {
  userId: string;
  userName: string;
  userInitial: string;
  initialMessages: ChatMessage[];
}) {
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
    const latest = messages[messages.length - 1];
    if (latest) markChatRead(latest.created_at);
  }, [messages]);

  async function handleSend() {
    if (sending) return;
    const body = text.trim();
    if (!pendingFile && !body) return;
    setSending(true);
    const clientId = crypto.randomUUID();
    try {
      const formData = new FormData();
      formData.set("clientId", clientId);
      if (body) formData.set("body", body);
      let mediaPath: string | null = null;
      if (pendingFile) {
        const uploaded = await uploadMediaFromBrowser(userId, pendingFile);
        mediaPath = uploaded.path;
        formData.set("mediaPath", uploaded.path);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: clientId,
          user_id: userId,
          name: userName,
          initial: userInitial,
          kind: mediaPath ? "media" : "text",
          body: body || null,
          storage_path: mediaPath,
          created_at: new Date().toISOString(),
        },
      ]);
      setText("");
      setPendingFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      await sendChatMessage(formData);
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== clientId));
    } finally {
      setSending(false);
    }
  }

  function mediaUrl(path: string | null) {
    if (!path) return null;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${path}`;
  }

  const VIDEO_EXTENSIONS = ["mp4", "mov", "webm", "m4v", "avi"];
  function isVideoPath(path: string | null) {
    if (!path) return false;
    const ext = path.split(".").pop()?.toLowerCase();
    return !!ext && VIDEO_EXTENSIONS.includes(ext);
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
                      {mediaUrl(m.storage_path) &&
                        (isVideoPath(m.storage_path) ? (
                          <video src={mediaUrl(m.storage_path)!} muted playsInline preload="metadata" />
                        ) : (
                          <Image src={mediaUrl(m.storage_path)!} alt="" width={180} height={135} unoptimized />
                        ))}
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
