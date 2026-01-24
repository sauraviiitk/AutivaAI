"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import clsx from "clsx";
import {
  Upload,
  Camera,
  Video,
  ChevronRight,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import ScreeningHero from "@/app/components/ScreeningHero";
import ScreeningImage from "@/app/components/ScreeningImage";
import ScreeningVideo from "@/app/components/ScreeningVideo";
import ScreeningEeg from "@/app/components/ScreeningEeg";

const steps = [
  {
    id: 1,
    title: "Selfie Capture",
    instruction:
      "Ensure good lighting. Face the camera directly and capture a clear selfie.",
  },
  {
    id: 2,
    title: "Video Recording",
    instruction:
      "Record a 10-second video. Keep the camera steady and your face clearly visible.\n\nNote: If you upload a video from your computer and its duration exceeds 10 seconds, only the first 10 seconds will be used.",
  },

  {
    id: 3,
    title: "EEG Upload",
    instruction:
      "Upload the EEG CSV file provided by the clinician or lab device. \n\nNote: Only .csv files are accepted. Please ensure the file is complete and unmodified.",
  },
];

export default function ScreeningPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const isCompleted = currentStep > steps.length;

  //photo
  const [photoBlob, setPhotoBlob] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  //video
  const [videoBlob, setVideoBlob] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  //eeg
  const [eegFile, setEegFile] = useState(null);

  const screeningProps = {
    currentStep,
    setCurrentStep,
    setVideoBlob,
    setPhotoBlob,
    photoURL,
    videoURL,
    setPhotoURL,
    setVideoURL,
    setEegFile,
    photoBlob,
    videoBlob,
    eegFile,
  };

  const userId = "0a5e7cfa-3a3a-4f4b-b3dc-f5e8a1717423";

  const [recordCount, setRecordCount] = useState(100);

  async function uploadFile(url, file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `Upload Failed at ${url}`);
    }

    return data.key;
  }

  async function fetchResult() {
    try {
      if (!photoBlob || !videoBlob || !eegFile) {
        toast.error("First upload all required files");
        return;
      }
      const res = await fetch(`/api/get-count?userId=${userId}`);
      const data = await res.json();

      if (!res.ok) {
        toast.error("Something Went Wrong");
        console.error("Error at /get-count ");
        return;
      }

      setRecordCount(data.count);

      const videoKey = await uploadFile("/api/upload/video", videoBlob);
      alert(videoKey);
      const imageKey = await uploadFile("/api/upload/image", photoBlob);
      alert(imageKey);
      const eegKey = await uploadFile("/api/upload/eeg", eegFile);
      alert(eegKey);
    } catch (err) {
      toast.error(`${err.message}`);
      console.error("Error at /get-count :", err.message);
      return;
    }
  }

  const eegProps = { fetchResult, ...screeningProps };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] gap-6  ">
      {/* Hero Page */}
      {currentStep === 0 && (
        <ScreeningHero setCurrentStep={setCurrentStep}></ScreeningHero>
      )}
      {/* Steps */}
      {currentStep >= 1 && (
        <>
          {/* LEFT PANEL */}
          <aside className="w-80 flex flex-col gap-6 pl-2 py-4">
            {/* Screenign Steps */}
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Screening Steps</h2>

              <div className="space-y-4">
                {steps.map((step) => (
                  <div key={step.id} className="flex items-center gap-3">
                    <div
                      className={clsx(
                        "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium",
                        step.id === currentStep && "bg-primary text-white",
                        step.id < currentStep && "bg-green-500/80 text-white",
                        step.id > currentStep &&
                          "bg-muted text-muted-foreground",
                      )}
                    >
                      {step.id}
                    </div>

                    <span
                      className={clsx(
                        "text-sm",
                        step.id === currentStep
                          ? "font-semibold"
                          : "text-muted-foreground",
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Instructions Box */}
            {!isCompleted && (
              <Card className="p-4 text-sm bg-muted/40 border border-border text-muted-foreground whitespace-pre-line">
                <h3 className="font-medium text-foreground mb-1">
                  Instructions
                </h3>
                {steps[currentStep - 1].instruction}
              </Card>
            )}
          </aside>

          {/* RIGHT PANEL */}
          <main className="flex-1 pr-2 py-4">
            {!isCompleted ? (
              <Card className="h-full flex flex-col items-center justify-center gap-6">
                {/* step-1 */}
                {currentStep === 1 && (
                  <ScreeningImage {...screeningProps}></ScreeningImage>
                )}
                {/* step-2 */}
                {currentStep === 2 && (
                  <ScreeningVideo {...screeningProps}></ScreeningVideo>
                )}

                {currentStep === 3 && (
                  <ScreeningEeg {...eegProps}></ScreeningEeg>
                )}
              </Card>
            ) : (
              // FINAL RESULT VIEW
              <div className="h-full flex items-center justify-center">
                <h1 className="text-4xl font-bold tracking-wide">
                  RESULT IS HERE {recordCount}
                </h1>
                <Button
                  onClick={() => {
                    fetchResult();
                  }}
                >
                  Submit
                </Button>
              </div>
            )}
          </main>
        </>
      )}
    </div>
  );
}
