"use client";

import api from "@/lib/api";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Filter, 
  Layout, 
  ListTodo, 
  MessageSquare, 
  MoreHorizontal, 
  Plus, 
  User,
  AlertCircle,
  Flag
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import TaskModal from "@/components/tasks/TaskModal";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "TO_DO" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  dueDate: string;
  assignedByName: string;
  assignedToName: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"assigned_to" | "assigned_by" | "all">("assigned_to");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/tasks?type=${filter}`);
      setTasks(res.data.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/tasks/${id}`, { status });
      toast.success("Task status updated");
      fetchTasks();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL": return "text-rose-600 bg-rose-50 border-rose-100";
      case "HIGH": return "text-amber-600 bg-amber-50 border-amber-100";
      case "MEDIUM": return "text-blue-600 bg-blue-50 border-blue-100";
      default: return "text-slate-600 bg-slate-50 border-slate-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED": return <CheckCircle2 className="text-emerald-500" size={18} />;
      case "IN_PROGRESS": return <Clock className="text-blue-500" size={18} />;
      default: return <Circle className="text-slate-300" size={18} />;
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full p-4 md:p-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 font-bricolage-grotesque tracking-tight">Task Center</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage individual responsibilities and tracked progress.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-[22px] text-sm font-bold transition-all shadow-xl shadow-slate-900/10 active:scale-95"
        >
           <Plus size={20} />
           <span>New Task</span>
        </button>
      </div>

      <div className="flex bg-white p-1.5 rounded-[22px] border border-slate-100 shadow-sm self-start">
         <button 
           onClick={() => setFilter("assigned_to")}
           className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${filter === "assigned_to" ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10" : "text-slate-400 hover:text-slate-600"}`}
         >
           Assigned to Me
         </button>
         <button 
           onClick={() => setFilter("assigned_by")}
           className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${filter === "assigned_by" ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10" : "text-slate-400 hover:text-slate-600"}`}
         >
           Assigned by Me
         </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
               <div key={i} className="h-32 w-full bg-slate-100 rounded-[32px] animate-pulse" />
            ))
         ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
               <div className="p-5 bg-white rounded-2xl shadow-sm text-slate-300 mb-4"><ListTodo size={32} /></div>
               <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No active tasks found in this view</p>
            </div>
         ) : (
            tasks.map(task => (
               <div key={task.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/20 group hover:-translate-y-1 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                     <div className="flex items-start gap-6 flex-1">
                        <button 
                          onClick={() => updateStatus(task.id, task.status === "COMPLETED" ? "TO_DO" : "COMPLETED")}
                          className="mt-1 transition-transform active:scale-90"
                        >
                           {getStatusIcon(task.status)}
                        </button>
                        <div className="space-y-4 flex-1">
                           <div>
                              <h3 className={`text-xl font-bold font-bricolage-grotesque ${task.status === "COMPLETED" ? "text-slate-400 line-through" : "text-slate-900"}`}>{task.title}</h3>
                              <p className="text-sm text-slate-500 mt-1 line-clamp-1">{task.description}</p>
                           </div>
                           <div className="flex flex-wrap gap-3">
                              <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getPriorityColor(task.priority)}`}>
                                 {task.priority} Priority
                              </div>
                              <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-slate-400 border border-slate-100">
                                 <Clock size={12} />
                                 <span className="text-[10px] font-bold uppercase tracking-wider">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Due Date'}</span>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="flex items-center justify-between lg:justify-end gap-10">
                        <div className="flex items-center gap-6">
                           <div className="flex flex-col text-right">
                              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Assignee</span>
                              <div className="flex items-center gap-2 mt-1">
                                 <div className="w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center text-[8px] font-bold text-white uppercase">{task.assignedToName.charAt(0)}</div>
                                 <span className="text-xs font-bold text-slate-700">{task.assignedToName}</span>
                              </div>
                           </div>
                           <div className="h-10 w-px bg-slate-100" />
                           <div className="flex items-center gap-2 px-6 py-3 bg-slate-50 rounded-2xl text-slate-400">
                              <MessageSquare size={16} />
                              <span className="text-xs font-bold uppercase tracking-widest">0</span>
                           </div>
                        </div>
                        <button className="p-3 hover:bg-slate-50 rounded-xl text-slate-300 transition-all"><MoreHorizontal size={20} /></button>
                     </div>
                  </div>
               </div>
            ))
         )}
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={fetchTasks} 
      />
    </div>
  );
}

