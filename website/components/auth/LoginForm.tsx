"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-slate-700 ml-1">
          Email address
        </label>
        <input
          type="email"
          placeholder="name@company.com"
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white/50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-1">
          <label className="text-sm font-semibold text-slate-700">
            Password
          </label>
          <Link
            href="#"
            className="text-xs font-semibold text-primary hover:text-blue-700"
          >
            Forgot?
          </Link>
        </div>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white/50"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className="w-full bg-primary text-white py-3.5 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 mt-2 active:scale-[0.98]">
        Sign in to Dashboard
      </button>
    </form>
  );
}
