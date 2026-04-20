"use client";

import EmployeeModal from "@/components/employees/EmployeeModal";
import api from "@/lib/api";
import {
  Briefcase,
  Building2,
  Circle,
  Edit2,
  Mail,
  Plus,
  Search,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

interface Employee {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  employeeCode: string;
  dob: string;
  gender: string;
  phone: string;
  emailOfficial: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  photoUrl: string | null;
  designation: string;
  departmentId: string;
  departmentName: string;
  joiningDate: string;
  employmentType: string;
  status: string;
}

function EmployeesList() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(search || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/employees");
      setEmployees(res.data.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdate = async (data: any) => {
    try {
      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee.id}`, data);
      } else {
        await api.post("/employees", data);
      }
      fetchEmployees();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save employee:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      try {
        await api.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (error) {
        console.error("Failed to delete employee:", error);
      }
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      `${emp.firstName} ${emp.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.departmentName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-emerald-50 text-emerald-600 ring-emerald-100";
      case "on leave":
        return "bg-amber-50 text-amber-600 ring-amber-100";
      default:
        return "bg-slate-50 text-slate-600 ring-slate-100";
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-bricolage-grotesque tracking-tight">
            Employee Directory
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Manage your workforce, their roles, and specialized departments.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingEmployee(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/80 text-white px-6 py-3.5 rounded-xl transition-all shadow-xl shadow-slate-900/10 active:scale-95 whitespace-nowrap"
        >
          <Plus size={18} />
          <span>Add Employee</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Staff",
            value: employees.length,
            icon: Users,
            color: "text-slate-900",
          },
          {
            label: "Active",
            value: employees.filter((e) => e.status.toLowerCase() === "active")
              .length,
            icon: Circle,
            color: "text-emerald-500",
          },
          {
            label: "Departments",
            value: new Set(employees.map((e) => e.departmentName)).size,
            icon: Building2,
            color: "text-blue-500",
          },
          {
            label: "New Joinees",
            value: employees.filter(
              (e) =>
                new Date(e.joiningDate) >
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            ).length,
            icon: Briefcase,
            color: "text-purple-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-lg transition-all"
          >
            <div>
              <p className="text-slate-500 tracking-widest mb-1">
                {stat.label}
              </p>
              <p
                className={`text-3xl font-bold font-bricolage-grotesque ${stat.color}`}
              >
                {stat.value}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-slate-100 transition-colors">
              <stat.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between bg-slate-50/20 gap-4">
          <div className="relative w-full max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-slate-500 font-normal border-b border-slate-50 bg-slate-50/10">
                <th className="pl-10 pr-6 py-5">Employee Info</th>
                <th className="px-6 py-5">Job Details</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Joined On</th>
                <th className="pl-6 pr-10 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="pl-10 pr-6 py-5">
                      <div className="h-10 w-40 bg-slate-100 rounded-lg" />
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-5 w-32 bg-slate-100 rounded-lg" />
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-5 w-20 bg-slate-100 rounded-lg" />
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-5 w-24 bg-slate-100 rounded-lg" />
                    </td>
                    <td className="pl-6 pr-10 py-5 text-right">
                      <div className="h-8 w-16 bg-slate-100 rounded-lg ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-24 text-center">
                    No employees found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="pl-10 pr-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100">
                          {emp.photoUrl ? (
                            <img
                              src={emp.photoUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User size={18} className="text-slate-500" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-slate-900">
                            {emp.firstName} {emp.lastName}
                          </span>
                          <span className="text-sm text-slate-500">
                            {emp.employeeCode}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-700">
                          {emp.designation}
                        </span>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Building2 size={10} />
                          {emp.departmentName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center px-5 py-1 rounded-full text-sm tracking-wider ring-1 ${getStatusColor(emp.status)}`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500">
                      {new Date(emp.joiningDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="pl-6 pr-10 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`mailto:${emp.emailOfficial}`}
                          className="p-2 hover:bg-white rounded-lg text-slate-500 hover:text-blue-500 border border-transparent hover:border-slate-100 transition-all"
                        >
                          <Mail size={16} />
                        </a>
                        <button
                          onClick={() => {
                            setEditingEmployee(emp);
                            setIsModalOpen(true);
                          }}
                          className="p-2 hover:bg-white rounded-lg text-slate-500 hover:text-blue-600 border border-transparent hover:border-slate-100 transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id)}
                          className="p-2 hover:bg-white rounded-lg text-slate-500 hover:text-red-500 border border-transparent hover:border-slate-100 transition-all"
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

      {isModalOpen && (
        <EmployeeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateOrUpdate}
          initialData={editingEmployee}
        />
      )}
    </div>
  );
}

export default function EmployeesPage() {
  return (
    <Suspense
      fallback={<div className="p-8 text-slate-500">Loading Directory...</div>}
    >
      <EmployeesList />
    </Suspense>
  );
}
