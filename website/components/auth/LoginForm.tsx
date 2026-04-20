"use client";

import api from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const data = response.data;

      // 1. Store token in localStorage
      localStorage.setItem("harbor_token", data.token);
      localStorage.setItem("harbor_user", JSON.stringify(data.user));

      // 2. Set cookie for SSR
      document.cookie = `harbor_token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

      // 3. Redirect based on password reset requirement
      if (data.user?.mustChangePassword) {
        router.push("/reset-password");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Invalid email or password. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      {error && (
        <div className="relative group animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute -inset-1 bg-linear-to-r from-red-500/20 to-orange-500/20 rounded-[20px] blur-md group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center gap-3 bg-white/60 backdrop-blur-md border border-red-100 p-4 rounded-xl shadow-sm">
            <div className="shrink-0 w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-500"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-800 leading-tight">
              {error}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-bold text-slate-600 ml-1 uppercase tracking-wider">
          Email address
        </label>
        <input
          type="email"
          placeholder="name@company.com"
          required
          disabled={isLoading}
          className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-white/50 text-slate-900 placeholder:text-slate-500 disabled:opacity-50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-1">
          <label className="text-[13px] font-bold text-slate-600 uppercase tracking-wider">
            Password
          </label>
          <Link
            href="#"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Forgot?
          </Link>
        </div>
        <input
          type="password"
          placeholder="••••••••"
          required
          disabled={isLoading}
          className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-white/50 text-slate-900 placeholder:text-slate-500 disabled:opacity-50"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="relative group w-full bg-blue-600 py-4 rounded-xl transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] overflow-hidden disabled:opacity-70"
      >
        <div className="absolute inset-0 bg-linear-to-r from-blue-700 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <span className="relative z-10 text-white font-bold tracking-wide flex items-center justify-center gap-3">
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            "Login"
          )}
        </span>
      </button>
    </form>
  );
}
