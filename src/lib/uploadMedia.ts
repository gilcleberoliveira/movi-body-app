"use client";

import { createClient } from "@/lib/supabase/client";

export type UploadedMedia = { path: string; kind: "photo" | "video" };

/**
 * Uploads directly from the browser to Supabase Storage, bypassing our own
 * server entirely — Vercel's Serverless Functions cap request bodies at
 * ~4.5MB regardless of Next.js config, which is far too small for phone
 * photos/videos, so this can't go through a Server Action.
 */
export async function uploadMediaFromBrowser(userId: string, file: File): Promise<UploadedMedia> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() || "bin";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type || undefined,
  });
  if (error) throw new Error(error.message);
  return { path, kind: file.type.startsWith("video/") ? "video" : "photo" };
}
