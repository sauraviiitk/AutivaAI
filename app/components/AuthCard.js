"use client";

import { Card } from "@/components/ui/card";

export default function AuthCard({ children, title, subtitle }) {
  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4 py-12">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50/50 pointer-events-none" />

      <div className="relative w-full max-w-md">
        <Card className="border border-slate-200/60 shadow-sm p-8 md:p-10">
          {/* Header */}
          <div className="mb-4 text-center">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
              Welcome to NeuroLensAI
            </h1>
            <p className="text-xs md:text-base text-slate-600">{subtitle}</p>
          </div>

          {/* Content */}
          {children}
        </Card>

        {/* Footer text */}
        <p className="text-center text-xs text-slate-400 mt-2">
          By clicking continue, you agree to our{" "}
          <spanc className="underline underline-offset-3 hover:text-slate-500">
            Terms of Service
          </spanc>{" "}
          and{" "}
          <span className="underline underline-offset-3 hover:text-slate-500">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </div>
  );
}
