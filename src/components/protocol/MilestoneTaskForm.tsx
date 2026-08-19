"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { CameraIcon, VideoIcon, TextIcon, MicIcon } from "@/components/icons";
import { completeMilestone } from "@/app/actions";
import { uploadMediaFromBrowser } from "@/lib/uploadMedia";
import type { Milestone } from "@/lib/data/milestones";

const TYPE_ICON = { photo: CameraIcon, video: VideoIcon, audio: MicIcon, text: TextIcon };
const TYPE_LABEL = { photo: "Photo proof", video: "Video proof", audio: "Audio proof", text: "Written proof" };

export function MilestoneTaskForm({
  milestone,
  alreadyDone,
  userId,
}: {
  milestone: Milestone;
  alreadyDone: boolean;
  userId: string;
}) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(alreadyDone);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ready = milestone.type === "text" ? text.trim().length > 0 : !!file;
  const Icon = TYPE_ICON[milestone.type];

  function handleFilePick(f: File | null) {
    setFile(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
  }

  function handleSubmit() {
    if (!ready || pending || submitted) return;
    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("milestoneId", String(milestone.id));
      if (milestone.type === "text") formData.set("responseText", text.trim());
      if (file) {
        try {
          const uploaded = await uploadMediaFromBrowser(userId, file);
          formData.set("proofPath", uploaded.path);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Upload failed. Please try again.");
          return;
        }
      }
      const result = await completeMilestone(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSubmitted(true);
      setTimeout(() => router.push("/protocol"), 900);
    });
  }

  return (
    <div className="task-box">
      <div className="task-label">
        <Icon />
        <span>{TYPE_LABEL[milestone.type]}</span>
        <span style={{ marginLeft: "auto", opacity: 0.7 }}>~{milestone.estimatedMinutes} min</span>
      </div>
      <p className="task-prompt">{milestone.prompt}</p>

      {milestone.type === "text" ? (
        <>
          <textarea
            className="task-input"
            rows={5}
            maxLength={milestone.charLimit}
            placeholder="Write here…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={submitted}
          />
          {milestone.charLimit && (
            <div className="char-count">
              {text.length}/{milestone.charLimit}
            </div>
          )}
        </>
      ) : (
        <div
          className={`upload-box${file ? " filled" : ""}`}
          onClick={() => !submitted && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={milestone.type === "photo" ? "image/*" : milestone.type === "video" ? "video/*" : "audio/*"}
            onChange={(e) => handleFilePick(e.target.files?.[0] ?? null)}
          />
          <Icon />
          <span className="u-label">
            {file ? `${TYPE_LABEL[milestone.type]} attached ✓` : `Tap to upload ${milestone.type}`}
          </span>
          {previewUrl && milestone.type === "photo" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="" className="upload-preview" />
          )}
        </div>
      )}

      <button
        className={`submit-btn${ready || submitted ? " ready" : ""}`}
        onClick={handleSubmit}
        disabled={submitted || pending}
      >
        {submitted ? "Completed" : pending ? "Saving…" : "Complete milestone"}
      </button>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
