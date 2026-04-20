"use client";

import api from "@/lib/api";
import { Logo } from "@/partials/common";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      const res = await api.post("/auth/forgot-password", { email });
      if (res.data.status === "success") {
        setStatus({
          type: "success",
          message: "A password reset link has been sent to your email address.",
        });
      }
    } catch (error: any) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-50 font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-60"></div>

      <div className="z-10 w-full max-w-[480px] flex flex-col gap-8">
        <div className="flex items-center justify-center gap-3">
          <Logo />
          <h1 className="font-bricolage-grotesque text-4xl">Harbor</h1>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[40px] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col gap-8">
          <div className="flex flex-col gap-2 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-blue-500/20">
              <Mail size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-bricolage-grotesque">
              Forgot Password?
            </h1>
            <p className="text-slate-500 text-sm font-medium px-4">
              Enter the email address associated with your account and we'll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-widest">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-5 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-white/50 text-slate-900 placeholder:text-slate-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
              </div>
            </div>

            {status && (
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 animate-in slide-in-from-top-2 ${
                  status.type === "success"
                    ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                    : "bg-red-50 border-red-100 text-red-600"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle2 size={18} className="shrink-0" />
                ) : null}
                <p className="text-xs font-bold leading-relaxed">
                  {status.message}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all shadow-xl shadow-blue-500/10 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : null}
              {isLoading ? "Sending Link..." : "Send Reset Link"}
            </button>

            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors mt-2"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
