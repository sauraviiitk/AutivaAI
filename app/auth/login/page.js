"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, Github } from "lucide-react";
import AuthCard from "@/app/components/AuthCard";
import { FcGoogle, FcGithub } from "react-icons/fc";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = email && password;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    // Frontend only - no actual submission
    setTimeout(() => setIsSubmitting(false), 1000);
  };

  return (
    <AuthCard subtitle="Secure access to your NeuroLensAI account">
      {/* Email and Password Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-semibold text-slate-700"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-11 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-semibold text-slate-700"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-11 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end pt-2">
          <Link
            href="#"
            className="text-sm text-[var(--color-accent)]/80 hover:text-[var(--color-accent)] font-semibold transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Sign In Button */}
        <Button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="w-full h-11 mt-6 bg-[var(--color-accent)]/80 hover:bg-[var(--color-accent)] text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-2">
        <Separator className="flex-1" />
        <span className="text-xs text-slate-400 uppercase tracking-wide font-semibold">
          OR
        </span>
        <Separator className="flex-1" />
      </div>

      {/* Social Authentication */}
      <div className=" mb-2 flex items-center gap-x-2 justify-center">
        <Button
          variant="outline"
          className=" h-11 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold transition-all duration-300 flex items-center justify-center gap-2"
        >
          <FcGoogle className="w-5 h-5"></FcGoogle>
          Continue with Google
        </Button>

        <Button
          variant="outline"
          className=" h-11 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Github className="w-5 h-5" />
          Continue with GitHub
        </Button>
      </div>

      {/* Sign Up Link */}
      <div className="text-center pt-2 border-t border-slate-200">
        <p className="text-sm text-slate-600">
          Don't have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-bold text-[var(--color-accent)]/80 hover:text-[var(--color-accent)] transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
