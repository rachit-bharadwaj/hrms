"use client";

import UserModal from "@/components/users/UserModal";
import api from "@/lib/api";
import {
  AlertCircle,
  Circle,
  Edit2,
  Search,
  Shield,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  roles: { id: string; name: string }[];
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

interface Role {
  id: string;
  name: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [usersRes, rolesRes] = await Promise.all([
        api.get("/users"),
        api.get("/roles"),
      ]);
      setUsers(usersRes.data.data);
      setRoles(rolesRes.data.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdate = async (data: any) => {
    if (editingUser) {
      await api.put(`/users/${editingUser.id}`, data);
    } else {
      await api.post("/users", data);
    }
    fetchData();
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/users/${userToDelete.id}`);
      setIsDeleteConfirmOpen(false);
      setUserToDelete(null);
      fetchData();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const getUserRolesText = (user: User) => {
    if (!user.roles || user.roles.length === 0) return "Unknown";
    return user.roles.map(r => r.name).join(", ");
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-8 w-full pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-bricolage-grotesque tracking-tight">User Management</h1>
          <p className="text-slate-500 text-sm font-medium">Manage organization accounts, security levels, and login status.</p>
        </div>
        <button 
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-xl shadow-slate-900/10 active:scale-95 whitespace-nowrap"
        >
          <UserPlus size={18} />
          <span>Add New Account</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Accounts", value: users.length, color: "text-slate-900", icon: Users },
          { label: "Active", value: users.filter(u => u.isActive).length, color: "text-emerald-500", icon: Circle },
          { label: "Admins", value: users.filter(u => getUserRolesText(u).includes("Admin")).length, color: "text-blue-500", icon: Shield },
          { label: "Restricted", value: users.filter(u => !u.isActive).length, color: "text-red-500", icon: AlertCircle }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-lg hover:shadow-blue-500/5 transition-all">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold font-bricolage-grotesque ${stat.color}`}>{stat.value}</p>
            </div>
            <div className={`p-3 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors`}>
              <stat.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between bg-slate-50/20 gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all placeholder:text-slate-400 shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 bg-slate-50/10">
                <th className="pl-10 pr-6 py-5">User Profile</th>
                <th className="px-6 py-5">Assigned Role</th>
                <th className="px-6 py-5">Access Status</th>
                <th className="px-6 py-5">Last Activity</th>
                <th className="pl-6 pr-10 py-5 text-right">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="pl-10 pr-6 py-5">
                      <div className="h-5 w-40 bg-slate-100 rounded-lg" />
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-5 w-24 bg-slate-100 rounded-lg" />
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-5 w-16 bg-slate-100 rounded-lg" />
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-5 w-32 bg-slate-100 rounded-lg" />
                    </td>
                    <td className="pl-6 pr-10 py-5 text-right">
                      <div className="h-8 w-16 bg-slate-100 rounded-lg ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-24 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-40">
                      <Search size={48} className="text-slate-300" />
                      <p className="text-sm font-bold text-slate-400 font-bricolage-grotesque">
                        No user records available
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="pl-10 pr-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 mb-0.5">
                          {user.email}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium font-sans">
                          Joined {formatDate(user.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold ring-1 ring-blue-100">
                        <Shield size={12} className="opacity-70" />
                        {getUserRolesText(user)}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          user.isActive
                            ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"
                            : "bg-red-50 text-red-600 ring-1 ring-red-100"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"}`}
                        />
                        {user.isActive ? "Active" : "Inactive"}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-xs font-medium text-slate-500">
                      {user.lastLoginAt
                        ? formatDate(user.lastLoginAt)
                        : "No session log"}
                    </td>
                    <td className="pl-6 pr-10 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setIsModalOpen(true);
                          }}
                          className="p-2.5 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 text-slate-400 hover:text-blue-600 transition-all hover:shadow-sm"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setUserToDelete(user);
                            setIsDeleteConfirmOpen(true);
                          }}
                          className="p-2.5 hover:bg-white rounded-xl border border-transparent hover:border-red-100 text-slate-400 hover:text-red-600 transition-all hover:shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        roles={roles}
        initialData={editingUser}
      />

      {/* Delete Confirmation */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsDeleteConfirmOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl p-8 flex flex-col items-center text-center animate-in zoom-in slide-in-from-top-4 duration-300">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-6 shadow-inner ring-1 ring-red-100">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 font-bricolage-grotesque">
              Permanent Deletion
            </h3>
            <p className="text-sm text-slate-500 font-medium mb-8 px-2">
              Are you sure you want to delete{" "}
              <span className="text-slate-900 font-bold">
                {userToDelete?.email}
              </span>
              ? This action is irreversible.
            </p>
            <div className="flex flex-col w-full gap-3">
              <button
                onClick={handleDelete}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl text-sm font-bold transition-all shadow-xl shadow-red-500/20 active:scale-95"
              >
                Yes, Delete Account
              </button>
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 py-4 rounded-2xl text-sm font-bold transition-all"
              >
                No, Keep It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
