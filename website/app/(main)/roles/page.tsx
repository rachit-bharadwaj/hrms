"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  Shield, 
  Search, 
  Edit2, 
  Trash2, 
  Plus,
  LockKeyhole,
  Info,
  ChevronRight,
  Loader2,
  AlertCircle
} from "lucide-react";
import RoleModal from "@/components/roles/RoleModal";
import RolePermissionsModal from "@/components/roles/RolePermissionsModal";

interface Role {
  id: string;
  name: string;
  description: string | null;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  
  // Permissions Modal state
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);
  const [targetRole, setTargetRole] = useState<Role | null>(null);

  // Error & Loading States
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/roles");
      setRoles(res.data.data);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdate = async (data: any) => {
    if (editingRole) {
      await api.put(`/roles/${editingRole.id}`, data);
    } else {
      await api.post("/roles", data);
    }
    fetchRoles();
  };

  const handleDelete = async () => {
    if (!roleToDelete) return;
    try {
      setDeleteError("");
      setIsDeleting(true);
      await api.delete(`/roles/${roleToDelete.id}`);
      setIsDeleteConfirmOpen(false);
      setRoleToDelete(null);
      fetchRoles();
    } catch (error: any) {
      setDeleteError(error.response?.data?.message || "Failed to delete role.");
      console.error("Failed to delete role:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-bricolage-grotesque">Role Management</h1>
          <p className="text-slate-500 text-sm font-medium">Define and manage organization access levels and their associated permissions.</p>
        </div>
        <button 
          onClick={() => {
            setEditingRole(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl text-sm font-bold transition-all shadow-xl shadow-blue-500/20 active:scale-95 whitespace-nowrap"
        >
          <Plus size={18} />
          <span>Create New Role</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm animate-pulse">
              <div className="h-6 w-24 bg-slate-100 rounded-lg mb-4" />
              <div className="h-4 w-full bg-slate-50 rounded-lg mb-2" />
              <div className="h-4 w-2/3 bg-slate-50 rounded-lg mb-6" />
              <div className="h-10 w-full bg-slate-100 rounded-xl" />
            </div>
          ))
        ) : filteredRoles.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center gap-4 opacity-40">
            <Shield size={64} className="text-slate-300" />
            <p className="text-lg font-bold text-slate-400 font-bricolage-grotesque">No roles defined yet</p>
          </div>
        ) : (
          filteredRoles.map((role) => (
            <div key={role.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group flex flex-col items-start text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button 
                  onClick={() => {
                    setEditingRole(role);
                    setIsModalOpen(true);
                  }}
                  className="p-2 hover:bg-blue-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                   onClick={() => {
                    setRoleToDelete(role);
                    setDeleteError("");
                    setIsDeleteConfirmOpen(true);
                  }}
                  className="p-2 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-5 shadow-inner ring-1 ring-blue-100">
                <Shield size={24} />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2 font-bricolage-grotesque">{role.name}</h3>
              <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-2 min-h-[40px]">
                {role.description || "No description provided for this role."}
              </p>

              <div className="mt-auto w-full pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <LockKeyhole size={14} className="text-blue-500" />
                  Manage Access
                </div>
                <button 
                  onClick={() => {
                    setTargetRole(role);
                    setIsPermModalOpen(true);
                  }}
                  className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <RoleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editingRole}
      />

      <RolePermissionsModal 
        isOpen={isPermModalOpen}
        onClose={() => setIsPermModalOpen(false)}
        role={targetRole}
      />

      {/* Delete Confirmation */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsDeleteConfirmOpen(false)} />
          <div className="relative w-full max-sm bg-white rounded-[32px] shadow-2xl p-8 flex flex-col items-center text-center animate-in zoom-in slide-in-from-top-4 duration-300">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-6 shadow-inner ring-1 ring-red-100">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 font-bricolage-grotesque">Delete Role?</h3>
            <p className="text-sm text-slate-500 font-medium mb-8 text-center px-4">
              Are you sure you want to delete <span className="text-slate-900 font-bold">{roleToDelete?.name}</span>? Users assigned to this role may lose access.
            </p>

            {deleteError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[11px] font-bold border border-red-100 flex items-start gap-3 mb-6 w-full text-left">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="flex flex-col w-full gap-3">
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-70 text-white py-4 rounded-2xl text-sm font-bold transition-all shadow-xl shadow-red-500/20 active:scale-95 flex items-center justify-center gap-2"
              >
                {isDeleting ? <Loader2 className="animate-spin" size={18} /> : null}
                {isDeleting ? "Deleting..." : "Yes, Delete Role"}
              </button>
              <button 
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setDeleteError("");
                }}
                disabled={isDeleting}
                className="w-full bg-slate-50 hover:bg-slate-100 disabled:opacity-50 text-slate-600 py-4 rounded-2xl text-sm font-bold transition-all"
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
