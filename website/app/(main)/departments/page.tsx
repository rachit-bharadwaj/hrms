"use client";

import api from "@/lib/api";
import {
  Building2,
  Edit2,
  Plus,
  Search,
  Trash2,
  Users,
  LayoutGrid,
  TrendingUp,
  Briefcase
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import DepartmentModal from "@/components/departments/DepartmentModal";
import { toast } from "react-hot-toast";

interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  employeeCount: number;
  createdAt: string;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/departments");
      setDepartments(res.data.data);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      toast.error("Failed to load departments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdate = async (data: any) => {
    try {
      if (editingDepartment) {
        await api.put(`/departments/${editingDepartment.id}`, data);
        toast.success("Department updated successfully");
      } else {
        await api.post("/departments", data);
        toast.success("Department created successfully");
      }
      fetchDepartments();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Failed to save department:", error);
      toast.error(error.response?.data?.message || "Failed to save department");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this department?")) {
      try {
        await api.delete(`/departments/${id}`);
        toast.success("Department deleted successfully");
        fetchDepartments();
      } catch (error: any) {
        console.error("Failed to delete department:", error);
        toast.error(error.response?.data?.message || "Failed to delete department");
      }
    }
  };

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEmployees = departments.reduce((acc, dept) => acc + dept.employeeCount, 0);

  return (
    <div className="flex flex-col gap-8 w-full pb-20 p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 font-bricolage-grotesque tracking-tight">
            Departments
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Build and manage your organizational structure and team distribution.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingDepartment(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl text-sm font-bold transition-all shadow-xl shadow-slate-900/10 active:scale-95 whitespace-nowrap group"
        >
          <div className="bg-white/10 p-1 rounded-lg group-hover:rotate-90 transition-transform duration-300">
            <Plus size={18} />
          </div>
          <span>Create Department</span>
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Departments", value: departments.length, icon: LayoutGrid, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Active Staff", value: totalEmployees, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Efficiency Rate", value: "94%", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Avg Team Size", value: departments.length ? Math.round(totalEmployees / departments.length) : 0, icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <p className={`text-4xl font-bold font-bricolage-grotesque ${stat.color}`}>{stat.value}</p>
            </div>
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden flex flex-col">
        {/* Search Bar */}
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between bg-slate-50/30 gap-6">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Filter by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 rounded-[22px] text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm placeholder:text-slate-400 placeholder:font-medium"
            />
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Directory
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] border-b border-slate-50 bg-slate-50/10">
                <th className="pl-10 pr-6 py-6">Department Details</th>
                <th className="px-6 py-6">Code</th>
                <th className="px-6 py-6">Staff Count</th>
                <th className="px-6 py-6">Description</th>
                <th className="pl-6 pr-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="pl-10 pr-6 py-7"><div className="h-12 w-48 bg-slate-100 rounded-2xl" /></td>
                    <td className="px-6 py-7"><div className="h-6 w-16 bg-slate-100 rounded-lg" /></td>
                    <td className="px-6 py-7"><div className="h-8 w-12 bg-slate-100 rounded-xl" /></td>
                    <td className="px-6 py-7"><div className="h-5 w-64 bg-slate-100 rounded-lg" /></td>
                    <td className="pl-6 pr-10 py-7 text-right"><div className="h-10 w-24 bg-slate-100 rounded-xl ml-auto" /></td>
                  </tr>
                ))
              ) : filteredDepartments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-6 bg-slate-50 rounded-full text-slate-300">
                        <Building2 size={48} />
                      </div>
                      <p className="text-slate-400 font-bold text-lg">No departments found</p>
                      <p className="text-slate-400 text-sm max-w-xs">Try adjusting your search or create a new department to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDepartments.map((dept) => (
                  <tr key={dept.id} className="group hover:bg-slate-50/80 transition-all duration-300">
                    <td className="pl-10 pr-6 py-7">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center shadow-lg shadow-slate-900/10 group-hover:rotate-3 transition-transform">
                          <Building2 size={24} className="text-white" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-slate-900 mb-0.5">{dept.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Department</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-7">
                      <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold tracking-wider ring-1 ring-blue-100">
                        {dept.code}
                      </span>
                    </td>
                    <td className="px-6 py-7">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                           {[1, 2, 3].map(i => (
                             <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                                <Users size={12} className="text-slate-400" />
                             </div>
                           ))}
                        </div>
                        <span className="text-sm font-bold text-slate-700">+{dept.employeeCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-7">
                      <p className="text-sm font-medium text-slate-500 max-w-md line-clamp-2 leading-relaxed">
                        {dept.description || "No description provided for this department."}
                      </p>
                    </td>
                    <td className="pl-6 pr-10 py-7 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                        <Link
                          href={`/employees?search=${encodeURIComponent(dept.name)}`}
                          className="p-3 bg-white hover:bg-emerald-50 rounded-2xl text-slate-400 hover:text-emerald-600 border border-slate-100 hover:border-emerald-100 transition-all shadow-sm"
                          title="View Staff"
                        >
                          <Users size={18} />
                        </Link>
                        <button
                          onClick={() => {
                            setEditingDepartment(dept);
                            setIsModalOpen(true);
                          }}
                          className="p-3 bg-white hover:bg-blue-50 rounded-2xl text-slate-400 hover:text-blue-600 border border-slate-100 hover:border-blue-100 transition-all shadow-sm"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(dept.id)}
                          className="p-3 bg-white hover:bg-red-50 rounded-2xl text-slate-400 hover:text-red-500 border border-slate-100 hover:border-red-100 transition-all shadow-sm"
                        >
                          <Trash2 size={18} />
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

      {isModalOpen && (
        <DepartmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateOrUpdate}
          initialData={editingDepartment}
        />
      )}
    </div>
  );
}
