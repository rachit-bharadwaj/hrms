"use client";

import api from "@/lib/api";
import { CheckCircle2, Loader2, Search, Shield, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Permission {
  id: string;
  code: string;
  description: string | null;
}

interface RolePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: { id: string; name: string } | null;
}

export default function RolePermissionsModal({
  isOpen,
  onClose,
  role,
}: RolePermissionsModalProps) {
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [assignedPermissionIds, setAssignedPermissionIds] = useState<string[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && role) {
      fetchData();
    }
  }, [isOpen, role]);

  const fetchData = async () => {
    if (!role) return;
    try {
      setIsLoading(true);
      const [allRes, roleRes] = await Promise.all([
        api.get("/permissions"),
        api.get(`/roles/${role.id}`),
      ]);
      setAllPermissions(allRes.data.data);
      // The role response includes permissions nested if using the getRoleById controller
      const assigned = roleRes.data.data.permissions || [];
      setAssignedPermissionIds(assigned.map((p: any) => p.id));
    } catch (error) {
      console.error("Failed to fetch role permissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePermission = async (permissionId: string) => {
    if (!role) return;
    setIsSaving(permissionId);
    try {
      const isAssigned = assignedPermissionIds.includes(permissionId);
      if (isAssigned) {
        await api.post("/roles/remove-permission", {
          roleId: role.id,
          permissionId,
        });
        setAssignedPermissionIds(
          assignedPermissionIds.filter((pId) => pId !== permissionId),
        );
      } else {
        await api.post("/roles/assign-permission", {
          roleId: role.id,
          permissionId,
        });
        setAssignedPermissionIds([...assignedPermissionIds, permissionId]);
      }
    } catch (error) {
      console.error("Failed to toggle permission:", error);
    } finally {
      setIsSaving(null);
    }
  };

  if (!isOpen || !role) return null;

  const filteredPermissions = allPermissions.filter((p) =>
    p.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-primary/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-300">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-bricolage-grotesque">
                Access Permissions
              </h2>
              <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
                Managing Role:{" "}
                <span className="text-blue-600 font-bold">{role.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-white rounded-xl text-slate-500 hover:text-slate-600 transition-all border border-transparent hover:border-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 flex flex-col gap-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search permissions code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-[20px] text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all placeholder:text-slate-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-slate-50 rounded-xl animate-pulse"
                  />
                ))
              : filteredPermissions.map((perm) => {
                  const isActive = assignedPermissionIds.includes(perm.id);
                  return (
                    <button
                      key={perm.id}
                      onClick={() => togglePermission(perm.id)}
                      disabled={isSaving !== null}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left group ${
                        isActive
                          ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-500/20 text-white"
                          : "bg-white border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 text-slate-600"
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={`text-[11px] font-bold font-mono uppercase tracking-wider ${isActive ? "text-blue-100" : "text-blue-600"}`}
                        >
                          {perm.code}
                        </span>
                        <span
                          className={`text-sm font-medium opacity-80 line-clamp-1`}
                        >
                          {perm.description || "No description"}
                        </span>
                      </div>
                      {isSaving === perm.id ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : isActive ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-200 group-hover:border-blue-200 transition-colors" />
                      )}
                    </button>
                  );
                })}
          </div>
        </div>

        <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-4 bg-primary text-white rounded-xl text-sm font-bold shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 active:scale-95 transition-all"
          >
            Done Managing
          </button>
        </div>
      </div>
    </div>
  );
}
