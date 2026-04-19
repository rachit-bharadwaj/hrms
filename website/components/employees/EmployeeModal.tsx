"use client";

import api from "@/lib/api";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export default function EmployeeModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: EmployeeModalProps) {
  const [formData, setFormData] = useState<any>({
    userId: "",
    firstName: "",
    lastName: "",
    employeeCode: "",
    emailOfficial: "",
    designation: "",
    departmentId: "",
    dob: "",
    gender: "Male",
    phone: "",
    joiningDate: new Date().toISOString().split("T")[0],
    employmentType: "Full-time",
    status: "Active",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [users, setUsers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        fetchEmployeeDetails(initialData.id);
      } else {
        setFormData({
          userId: "",
          firstName: "",
          lastName: "",
          employeeCode: "",
          emailOfficial: "",
          designation: "",
          departmentId: "",
          dob: "",
          gender: "Male",
          phone: "",
          joiningDate: new Date().toISOString().split("T")[0],
          employmentType: "Full-time",
          status: "Active",
          addressLine1: "",
          city: "",
          state: "",
          pincode: "",
          country: "India",
        });
      }
      fetchGroups();
    }
  }, [isOpen, initialData]);

  const fetchEmployeeDetails = async (id: string) => {
    try {
      const res = await api.get(`/employees/${id}`);
      const data = res.data.data;
      setFormData({
        ...data,
        dob: data.dob ? new Date(data.dob).toISOString().split("T")[0] : "",
        joiningDate: data.joiningDate ? new Date(data.joiningDate).toISOString().split("T")[0] : "",
      });
    } catch (error) {
      console.error("Failed to fetch employee details:", error);
    }
  };

  const fetchGroups = async () => {
    try {
      setIsLoadingGroups(true);
      const [uRes, dRes] = await Promise.all([
        api.get("/users"),
        api.get("/departments"),
      ]);
      setUsers(uRes.data.data);
      setDepartments(dRes.data.data);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    } finally {
      setIsLoadingGroups(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-bricolage-grotesque">
              {initialData ? "Edit Employee Profile" : "Register New Employee"}
            </h2>
            <p className="text-slate-500 text-sm font-medium">Complete organization profile and personal details.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-900 shadow-sm border border-transparent hover:border-slate-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[70vh]">
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Section: Basic Info */}
            <div className="lg:col-span-3">
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">Core Identity</h3>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Connect User Account</label>
              <select
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
              >
                <option value="">Select Account</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.email}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Employee Code</label>
              <input
                type="text"
                name="employeeCode"
                value={formData.employeeCode}
                onChange={handleChange}
                placeholder="EMP-001"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Official Email</label>
              <input
                type="email"
                name="emailOfficial"
                value={formData.emailOfficial}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Section: Employment Details */}
            <div className="lg:col-span-3 mt-4">
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">Organizational Role</h3>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Department</label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
              >
                <option value="">Select Dept</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Joining Date</label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Employment Type</label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
              >
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Resigned">Resigned</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>

            {/* Section: Personal Info */}
            <div className="lg:col-span-3 mt-4">
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">Personal Information</h3>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Address Line 1</label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
            >
              {initialData ? "Update Employee" : "Register Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
