"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function ScreeningPage() {
  const [step, setStep] = useState(1);

  const [imageKey, setImageKey] = useState(null);
  const [videoKey, setVideoKey] = useState(null);
  const [eegKey, setEegKey] = useState(null);

  const [result, setResult] = useState(null);

  async function uploadImage(file) {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload/image", {
      method: "POST",
      body: form,
    });

    if (!res.ok) return toast.error("Image upload failed");

    const data = await res.json();
    setImageKey(data.key);
    setStep(2);
  }

  async function uploadVideo(file) {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);

    video.onloadedmetadata = async () => {
      const d = video.duration;

      if (d < 10) return toast.error("Video must be at least 10 seconds");
      if (d > 20) return toast.error("Video must be less than 20 seconds");

      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/upload/video", {
        method: "POST",
        body: form,
      });

      if (!res.ok) return toast.error("Video upload failed");

      const data = await res.json();
      setVideoKey(data.key);
      setStep(3);
    };
  }

  async function uploadEEG(file) {
    if (!file.name.endsWith(".csv")) {
      return toast.error("Only CSV allowed");
    }

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload/eeg", {
      method: "POST",
      body: form,
    });

    if (!res.ok) return toast.error("EEG upload failed");

    const data = await res.json();
    setEegKey(data.key);
  }

  async function fetchResult() {
    const res = await fetch("/api/fetch-result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageKey, videoKey, eegKey }),
    });

    const data = await res.json();
    setResult(data.output);
  }

  if (result) {
    return (
      <div className="h-full flex items-center justify-center">
        <h1 className="text-4xl font-bold">RESULT IS HERE</h1>
      </div>
    );
  }

  return (
    <Card className="p-10 space-y-6">
      {step === 1 && (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => uploadImage(e.target.files[0])}
          />
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => uploadVideo(e.target.files[0])}
          />
        </>
      )}

      {step === 3 && (
        <>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => uploadEEG(e.target.files[0])}
          />
          {imageKey && videoKey && eegKey && (
            <Button onClick={fetchResult}>Fetch Result</Button>
          )}
        </>
      )}
    </Card>
  );
}
