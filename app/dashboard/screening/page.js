"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Camera, Video, ChevronRight } from "lucide-react";
import clsx from "clsx";

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
      "Record a 10-second video. Keep the camera steady and face visible.",
  },
  {
    id: 3,
    title: "EEG Upload",
    instruction:
      "Upload the EEG CSV file provided by the clinician or lab device.",
  },
];

export default function ScreeningPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [photoBlob, setPhotoBlob] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const fileInputRef = useRef(null);
  const isCompleted = currentStep > steps.length;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  async function openCamera() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      setStream(mediaStream);
      videoRef.current.srcObject = mediaStream;
    } catch (err) {
      console.error("Camera access denied", err);
    }
  }

  function closeCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setStream(null);
  }

  function capturePhoto() {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      setPhotoBlob(blob);
      setPhotoURL(URL.createObjectURL(blob));
      console.log(blob);
    }, "image/jpeg");

    closeCamera();
  }

  function handleFileUpload(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Max 5MB allowed");
      return;
    }

    // close camera if open
    closeCamera();

    // revoke old preview (memory safety)
    if (photoURL) {
      URL.revokeObjectURL(photoURL);
    }

    setPhotoBlob(file);
    setPhotoURL(URL.createObjectURL(file));
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-6">
      {/* LEFT PANEL */}
      <aside className="w-80 flex flex-col gap-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Screening Steps</h2>

          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-3">
                <div
                  className={clsx(
                    "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium",
                    step.id === currentStep && "bg-primary text-white",
                    step.id < currentStep && "bg-green-500 text-white",
                    step.id > currentStep && "bg-muted text-muted-foreground",
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
          <Card className="p-4 text-sm text-muted-foreground">
            <h3 className="font-medium text-foreground mb-2">Instructions</h3>
            {steps[currentStep - 1].instruction}
          </Card>
        )}
      </aside>

      {/* RIGHT PANEL */}
      <main className="flex-1">
        {!isCompleted ? (
          <Card className="h-full flex flex-col items-center justify-center gap-6">
            {currentStep === 1 && (
              <>
                {/* <div className="w-full h-full bg-emerald-400 grid grid-rows-3 grid-rows-[6fr_1fr_1fr]">
                  <div>
                    <Camera className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div>
                    <input type="file" accept="image/*"></input>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button onClick={() => setCurrentStep(2)}>
                      Upload Selfie
                    </Button>
                    <Button onClick={() => setCurrentStep(2)}>
                      Upload Selfie
                    </Button>
                  </div>
                </div> */}

                <div className="w-full h-full  grid grid-rows-[6fr_1fr] gap-4 p-4">
                  {/* CAMERA / PREVIEW AREA */}
                  <div className="flex items-center justify-center rounded-lg border bg-black overflow-hidden">
                    {photoURL ? (
                      <img
                        src={photoURL}
                        alt="Captured selfie"
                        className="w-full h-full object-cover"
                      />
                    ) : stream ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center gap-y-4">
                        <Camera className="size-10 text-white"></Camera>
                        <Button variant="outline" onClick={openCamera}>
                          Open Camera
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-3">
                      {!photoURL && (
                        <Button
                          variant="outline"
                          onClick={capturePhoto}
                          disabled={!stream}
                        >
                          Capture
                        </Button>
                      )}

                      {photoURL && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            // URL.revokeObjectURL(photoURL);
                            // openCamera();
                            setPhotoURL(null);
                            setPhotoBlob(null);
                          }}
                        >
                          Retake
                        </Button>
                      )}

                      {stream && (
                        <Button variant="outline" onClick={closeCamera}>
                          Close Camera
                        </Button>
                      )}

                      <label className="cursor-pointer">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file);

                            // allow selecting same file again
                            e.target.value = "";
                          }}
                        />
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            fileInputRef.current?.click();
                          }}
                        >
                          Upload File
                        </Button>
                      </label>
                    </div>

                    <Button onClick={() => setCurrentStep(2)}>
                      Next <ChevronRight className="size-5"></ChevronRight>
                    </Button>
                  </div>
                </div>

                {/* <Camera className="h-12 w-12 text-muted-foreground"/>
                <p className="text-lg font-medium">Capture and Upload Selfie</p>
                <Button onClick={() => setCurrentStep(2)}>Upload Selfie</Button> */}
              </>
            )}

            {currentStep === 2 && (
              <>
                <Video className="h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium">Record 10s Video</p>
                <Button onClick={() => setCurrentStep(3)}>Upload Video</Button>
              </>
            )}

            {currentStep === 3 && (
              <>
                <Upload className="h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium">Upload EEG CSV File</p>
                <Button onClick={() => setCurrentStep(4)}>
                  Upload EEG File
                </Button>
              </>
            )}
          </Card>
        ) : (
          // FINAL RESULT VIEW
          <div className="h-full flex items-center justify-center">
            <h1 className="text-4xl font-bold tracking-wide">RESULT IS HERE</h1>
          </div>
        )}
      </main>
    </div>
  );
}
