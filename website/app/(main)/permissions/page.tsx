"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  LockKeyhole,
  Search,
  Edit2,
  Trash2,
  Plus,
  Code,
  AlertCircle,
  Loader2,
  Info,
} from "lucide-react";
import PermissionModal from "@/components/permissions/PermissionModal";

interface Permission {
  id: string;
  code: string;
  description: string | null;
}

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(
    null,
  );
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] =
    useState<Permission | null>(null);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/permissions");
      setPermissions(res.data.data);
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdate = async (data: any) => {
    if (editingPermission) {
      await api.put(`/permissions/${editingPermission.id}`, data);
    } else {
      await api.post("/permissions", data);
    }
    fetchPermissions();
  };

  const handleDelete = async () => {
    if (!permissionToDelete) return;
    try {
      await api.delete(`/permissions/${permissionToDelete.id}`);
      setIsDeleteConfirmOpen(false);
      setPermissionToDelete(null);
      fetchPermissions();
    } catch (error) {
      console.error("Failed to delete permission:", error);
    }
  };

  const getModuleFromCode = (code: string) => {
    return code.split("_")[0];
  };

  const getActionFromCode = (code: string) => {
    const parts = code.split("_");
    return parts.slice(1).join(" ");
  };

  const getActionColor = (code: string) => {
    if (code.includes("_VIEW")) return "bg-blue-50 text-blue-600 ring-blue-100";
    if (code.includes("_CREATE"))
      return "bg-emerald-50 text-emerald-600 ring-emerald-100";
    if (
      code.includes("_EDIT") ||
      code.includes("_MANAGE") ||
      code.includes("_UPDATE")
    )
      return "bg-amber-50 text-amber-600 ring-amber-100";
    if (code.includes("_DELETE")) return "bg-red-50 text-red-600 ring-red-100";
    return "bg-slate-50 text-slate-600 ring-slate-100";
  };

  const filteredPermissions = permissions.filter(
    (perm) =>
      perm.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perm.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Grouping permissions by module
  const groupedPermissions = filteredPermissions.reduce(
    (acc, perm) => {
      const module = getModuleFromCode(perm.code);
      if (!acc[module]) acc[module] = [];
      acc[module].push(perm);
      return acc;
    },
    {} as Record<string, Permission[]>,
  );

  return (
    <div className="flex flex-col gap-8 w-full pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-bricolage-grotesque tracking-tight">
            System Permissions
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Fine-grained access control identifiers for the Harbor HRMS engine.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingPermission(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/80 text-white px-6 py-3.5 rounded-xl text-sm font-bold transition-all shadow-xl shadow-slate-900/10 active:scale-95 whitespace-nowrap"
        >
          <Plus size={18} />
          <span>New Permission</span>
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="relative w-full max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by code or module..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all placeholder:text-slate-500 shadow-sm"
            />
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl text-blue-600 text-xs font-bold ring-1 ring-blue-100">
            <Info size={14} />
            Total {permissions.length} Identifiers
          </div>
        </div>

        <div className="p-4 md:p-8 flex flex-col gap-10">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="h-4 w-24 bg-slate-100 rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-12 w-full bg-slate-50 rounded-xl animate-pulse" />
                  <div className="h-12 w-full bg-slate-50 rounded-xl animate-pulse" />
                </div>
              </div>
            ))
          ) : Object.keys(groupedPermissions).length === 0 ? (
            <div className="py-20 text-center">
              <div className="flex flex-col items-center gap-3 opacity-40">
                <LockKeyhole size={64} className="text-slate-300" />
                <p className="text-lg font-bold text-slate-500 font-bricolage-grotesque">
                  No access policies found
                </p>
              </div>
            </div>
          ) : (
            Object.entries(groupedPermissions).map(([module, perms]) => (
              <div key={module} className="flex flex-col gap-4">
                <div className="flex items-center gap-3 ml-1">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                    {module}
                  </h3>
                  <span className="text-sm font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {perms.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {perms.map((perm) => (
                    <div
                      key={perm.id}
                      className="group relative bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-xl hover:shadow-blue-500/5 p-5 rounded-[24px] transition-all flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={`px-2.5 py-1 rounded-lg text-sm font-bold uppercase tracking-wider ring-1 ${getActionColor(perm.code)}`}
                        >
                          {getActionFromCode(perm.code)}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingPermission(perm);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-blue-600 transition-all"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setPermissionToDelete(perm);
                              setIsDeleteConfirmOpen(true);
                            }}
                            className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-red-600 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-mono font-bold text-slate-500 group-hover:text-slate-500 transition-colors">
                          {perm.code}
                        </span>
                        <p className="text-[11px] font-medium text-slate-500 leading-relaxed line-clamp-2">
                          {perm.description ||
                            "System security identifier with no specific notes."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <PermissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editingPermission}
      />

      {/* Delete Confirmation */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-primary/60 backdrop-blur-md animate-in fade-in duration-300"
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
                {permissionToDelete?.code}
              </span>
              ? This could break system access checks.
            </p>
            <div className="flex flex-col w-full gap-3">
              <button
                onClick={handleDelete}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl text-sm font-bold transition-all shadow-xl shadow-red-500/20 active:scale-95"
              >
                Delete Permission
              </button>
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 py-4 rounded-xl text-sm font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
