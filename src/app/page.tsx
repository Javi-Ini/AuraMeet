"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit() {
    if (!file) return;

    setLoading(true);
    setNotes("");

    setStatus("Uploading file...");
    const formData = new FormData();
    formData.append("file", file);

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const uploadData = await uploadRes.json();
    const meetingId = uploadData.meeting.id;

    setStatus("Transcribing audio... (this may take a minute)");
    await fetch("/api/transcribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meetingId }),
    });

    setStatus("Generating meeting notes...");
    const notesRes = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meetingId }),
    });
    const notesData = await notesRes.json();

    setNotes(notesData.meeting.notes);
    setStatus("Done!");
    setLoading(false);
  }

  function handleExport() {
    const blob = new Blob([notes], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "meeting-notes.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
      <h1>AuraMeet</h1>
      <p>Upload a Zoom recording to generate structured meeting notes.</p>

      <div style={{ margin: "2rem 0" }}>
        <input
          type="file"
          accept=".mp4,.m4a,.aiff,.mp3,.wav"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}
        >
          {loading ? "Processing..." : "Generate Notes"}
        </button>
      </div>

      {status && <p><strong>{status}</strong></p>}

      {notes && (
        <div style={{ marginTop: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <h2 style={{ margin: 0 }}>Meeting Notes</h2>
            <button
              onClick={handleExport}
              style={{ padding: "0.4rem 0.8rem" }}
            >
              Export as Markdown
            </button>
          </div>
          <div style={{ background: "#f5f5f5", padding: "1.5rem", borderRadius: 8 }}>
            <ReactMarkdown>{notes}</ReactMarkdown>
          </div>
        </div>
      )}
    </main>
  );
}