"use client";

import api from "@/lib/api";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Save,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Profile Form
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
  });

  // Password Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Status handling
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
    section: "profile" | "password";
  } | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/auth/me");
      if (response.data.status === "success") {
        setUserData(response.data.user);
        setProfileForm({
          name: response.data.user.name || "",
          email: response.data.user.email || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setStatus(null);
    try {
      const res = await api.post("/auth/update-profile", profileForm);
      if (res.data.status === "success") {
        setStatus({
          type: "success",
          message: "Profile updated successfully",
          section: "profile",
        });
        fetchUser(); // Refresh user data
      }
    } catch (error: any) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Failed to update profile",
        section: "profile",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setStatus({
        type: "error",
        message: "New passwords do not match",
        section: "password",
      });
      return;
    }

    setIsChangingPassword(true);
    setStatus(null);
    try {
      const res = await api.post("/auth/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      if (res.data.status === "success") {
        setStatus({
          type: "success",
          message: "Password changed successfully",
          section: "password",
        });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error: any) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Failed to change password",
        section: "password",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 w-full pb-20 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-bricolage-grotesque tracking-tight italic">
          Account Settings
        </h1>
        <p className="text-slate-500 text-sm font-medium">
          Manage your personal information, security, and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Profile Summary */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 flex flex-col items-center text-center">
            <div className="relative group cursor-pointer">
              <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden bg-slate-50 ring-4 ring-white shadow-xl shadow-blue-500/10 group-hover:shadow-blue-500/20 transition-all flex items-center justify-center">
                {userData?.avatar ? (
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-slate-300" />
                )}
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-bold text-slate-900 font-bricolage-grotesque">
                {userData?.name || "Member Name"}
              </h2>

              {userData?.designation && (
                <p className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block mt-2">
                  {userData?.designation}
                </p>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50 w-full flex flex-col gap-4 text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                  <Mail size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Email Address
                  </span>
                  <span className="text-sm font-medium text-slate-900 truncate">
                    {userData?.email}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                  <KeyRound size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Role Level
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    Administrator
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Profile Section */}
          <section className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 md:p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-bricolage-grotesque">
                  Public Profile
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  Update your basic information seen by others.
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, name: e.target.value })
                    }
                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-3xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                    placeholder="E.g. Rachit Bharadwaj"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-3xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-mono"
                    placeholder="rachit@company.com"
                  />
                </div>
              </div>

              {/* Status Message */}
              {status?.section === "profile" && (
                <div
                  className={`flex items-center gap-3 p-4 rounded-2xl border ${status.type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-red-50 border-red-100 text-red-600"} animate-in slide-in-from-top-2`}
                >
                  {status.type === "success" ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <Loader2 size={18} />
                  )}
                  <span className="text-sm font-bold">{status.message}</span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-70 text-white px-8 py-4 rounded-2xl text-sm font-bold transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                >
                  {isUpdatingProfile ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  <span>
                    {isUpdatingProfile ? "Saving..." : "Save Changes"}
                  </span>
                </button>
              </div>
            </form>
          </section>

          {/* Security Section */}
          <section className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 md:p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                <Lock size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-bricolage-grotesque">
                  Security
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  Ensure your account is using a long, random password to stay
                  secure.
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full pl-5 pr-14 py-4 bg-slate-50/50 border border-slate-100 rounded-3xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all font-mono"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-3xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all font-mono"
                      placeholder="Min 8 characters"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                    Confirm Password
                  </label>
                  <input
                    type={showNewPass ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-3xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all font-mono"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              {/* Status Message */}
              {status?.section === "password" && (
                <div
                  className={`flex items-center gap-3 p-4 rounded-2xl border ${status.type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-red-50 border-red-100 text-red-600"} animate-in slide-in-from-top-2`}
                >
                  {status.type === "success" ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <Loader2 size={18} />
                  )}
                  <span className="text-sm font-bold">{status.message}</span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="bg-amber-500 hover:bg-amber-600 disabled:opacity-70 text-white px-8 py-4 rounded-2xl text-sm font-bold transition-all shadow-xl shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  {isChangingPassword ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <KeyRound size={18} />
                  )}
                  <span>
                    {isChangingPassword ? "Verifying..." : "Update Security"}
                  </span>
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
