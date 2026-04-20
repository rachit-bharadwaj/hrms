"use client";

import api from "@/lib/api";
import { Logo } from "@/partials/common";
import {
  CheckCircle2,
  KeyRound,
  Loader2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match" });
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      let res;
      if (token) {
        // Reset from email link
        res = await api.post("/auth/reset-password", {
          token,
          newPassword: form.newPassword,
        });
      } else {
        // Must change password flow
        res = await api.post("/auth/change-password", {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        });
      }

      if (res.data.status === "success") {
        setStatus({
          type: "success",
          message: "Password updated successfully! Redirecting to login...",
        });
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error: any) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Failed to update password",
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
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-bricolage-grotesque">
              {token ? "Set New Password" : "Secure Your Account"}
            </h1>
            <p className="text-slate-500 text-sm font-medium px-4">
              {token
                ? "Enter your new password below to regain access to your account."
                : "Your administrator requires you to change your password on your first login."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {!token && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-widest">
                  Temporary Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="The password provided to you"
                    className="w-full pl-12 pr-5 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-white/50 text-slate-900 placeholder:text-slate-300"
                    value={form.currentPassword}
                    onChange={(e) =>
                      setForm({ ...form, currentPassword: e.target.value })
                    }
                  />
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-widest">
                  New Secure Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Min. 8 characters"
                    className="w-full pl-12 pr-5 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-white/50 text-slate-900 placeholder:text-slate-300"
                    value={form.newPassword}
                    onChange={(e) =>
                      setForm({ ...form, newPassword: e.target.value })
                    }
                  />
                  <KeyRound
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-widest">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Repeat new password"
                    className="w-full pl-12 pr-5 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-white/50 text-slate-900 placeholder:text-slate-300"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                  />
                  <KeyRound
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                </div>
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all shadow-xl shadow-blue-500/10 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : null}
              {isLoading ? "Updating Password..." : token ? "Reset Password" : "Set New Password & Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
