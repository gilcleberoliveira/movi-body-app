"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { CameraIcon, VideoIcon, TextIcon } from "@/components/icons";
import { completeProtocolStep } from "@/app/actions";
import type { ProtocolStep } from "@/lib/data/protocolSteps";

export function StepTaskForm({ step, alreadyDone }: { step: ProtocolStep; alreadyDone: boolean }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(alreadyDone);
  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ready = step.type === "text" ? text.trim().length > 0 : !!file;

  function handleFilePick(f: File | null) {
    setFile(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
  }

  function handleSubmit() {
    if (!ready || pending || submitted) return;
    startTransition(async () => {
      const formData = new FormData();
      formData.set("stepId", String(step.id));
      formData.set("type", step.type);
      if (step.type === "text") formData.set("responseText", text.trim());
      if (file) formData.set("file", file);
      await completeProtocolStep(formData);
      setSubmitted(true);
      setTimeout(() => router.push("/protocol"), 900);
    });
  }

  if (step.type === "text") {
    return (
      <div className="task-box">
        <div className="task-label">
          <TextIcon />
          <span>Written task</span>
        </div>
        <p className="task-prompt">{step.prompt}</p>
        <textarea
          className="task-input"
          rows={5}
          maxLength={step.charLimit}
          placeholder="Write here…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={submitted}
        />
        <div className="char-count">
          {text.length}/{step.charLimit}
        </div>
        <button className={`submit-btn${ready || submitted ? " ready" : ""}`} onClick={handleSubmit} disabled={submitted || pending}>
          {submitted ? "Completed" : pending ? "Saving…" : "Mark complete"}
        </button>
      </div>
    );
  }

  // photo or video
  const label = step.type === "photo" ? "Photo task" : "Video task";
  return (
    <div className="task-box">
      <div className="task-label">
        {step.type === "photo" ? <CameraIcon /> : <VideoIcon />}
        <span>{label}</span>
      </div>
      <p className="task-prompt">{step.prompt}</p>
      <div
        className={`upload-box${file ? " filled" : ""}`}
        onClick={() => !submitted && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={step.type === "photo" ? "image/*" : "video/*"}
          onChange={(e) => handleFilePick(e.target.files?.[0] ?? null)}
        />
        {step.type === "photo" ? <CameraIcon /> : <VideoIcon />}
        <span className="u-label">
          {file ? `${step.type === "photo" ? "Photo" : "Video"} attached ✓` : `Tap to upload ${step.type}`}
        </span>
        {previewUrl && step.type === "photo" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="" className="upload-preview" />
        )}
      </div>
      <button className={`submit-btn${ready || submitted ? " ready" : ""}`} onClick={handleSubmit} disabled={submitted || pending}>
        {submitted ? "Completed" : pending ? "Saving…" : "Mark complete"}
      </button>
    </div>
  );
}
