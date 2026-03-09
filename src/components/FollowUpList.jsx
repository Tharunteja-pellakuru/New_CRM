import React, { useState } from "react";
import {
  Clock,
  Bell,
  CheckCircle2,
  Plus,
  MessageSquare,
  Phone,
  Check,
  X,
  ChevronDown,
  UserPlus,
  Search,
  Edit2,
  Trash2,
  Calendar,
} from "lucide-react";

const FollowUpList = ({
  followUps,
  clients,
  onToggleStatus,
  onAddFollowUp,
  onEditFollowUp,
  onDeleteFollowUp,
  onNavigate,
  typeFilter = "All",
  activeFilter = "All",
  setActiveFilter,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientId: "",
    title: "",
    description: "",
    followup_date: new Date().toISOString().split("T")[0],
    followup_mode: "call",
    followup_status: "pending",
    follow_brief: "",
    priority: "Medium",
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionBrief, setCompletionBrief] = useState("");
  const [completingFollowUpId, setCompletingFollowUpId] = useState(null);

  const getClientById = (id) => clients.find((c) => c.id === id);
  const isOverdue = (date) =>
    new Date(date) < new Date(new Date().setHours(0, 0, 0, 0));
  const isToday = (date) => {
    const d = new Date(date);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  // Base filtering (type + category + search) — before status tab filter
  const baseFiltered = followUps.filter((f) => {
    const client = getClientById(f.clientId);
    if (typeFilter !== "All") {
      if (!client) return false;
      if (typeFilter === "Active" && client.status !== "Active") return false;
      if (typeFilter === "Lead" && client.status !== "Lead") return false;
    }

    // Category filter (Tech/Media)
    if (categoryFilter !== "All") {
      if (!client) return false;
      if ((client.projectCategory || client.industry) !== categoryFilter)
        return false;
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      if (!matchesTitle && !matchesClient && !matchesCompany) return false;
    }

    // Date Range Filter
    if (startDate || endDate) {
      const dueDate = new Date(f.dueDate);
      if (startDate && dueDate < new Date(startDate)) return false;
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (dueDate > end) return false;
      }
    }

    return true;
  });

  // Tab counts
  const tabCounts = {
    All: baseFiltered.length,
    Overdue: baseFiltered.filter(
      (f) => isOverdue(f.dueDate) && f.status === "pending",
    ).length,
    Today: baseFiltered.filter(
      (f) => isToday(f.dueDate) && f.status === "pending",
    ).length,
    Upcoming: baseFiltered.filter(
      (f) =>
        !isOverdue(f.dueDate) && !isToday(f.dueDate) && f.status === "pending",
    ).length,
  };

  const filteredFollowUps = baseFiltered
    .filter((f) => {
      if (f.status === "completed" && activeFilter !== "All") return false;
      if (activeFilter === "Overdue")
        return isOverdue(f.dueDate) && f.status === "pending";
      if (activeFilter === "Today")
        return isToday(f.dueDate) && f.status === "pending";
      if (activeFilter === "Upcoming")
        return (
          !isOverdue(f.dueDate) && !isToday(f.dueDate) && f.status === "pending"
        );
      return true;
    })
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      onEditFollowUp &&
        onEditFollowUp({
          ...formData,
          dueDate: new Date(formData.followup_date).toISOString(),
        });
    } else {
      onAddFollowUp({
        ...formData,
        dueDate: new Date(formData.followup_date).toISOString(),
      });
    }
    setShowAddModal(false);
    setFormData({
      clientId: "",
      title: "",
      description: "",
      followup_date: new Date().toISOString().split("T")[0],
      followup_mode: "call",
      followup_status: "pending",
      follow_brief: "",
      priority: "Medium",
    });
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case "High":
        return "bg-error/10 text-error border-error/20";
      case "Medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "Low":
        return "bg-info/10 text-info border-info/20";
    }
  };

  return (
    <div className="w-full relative">
      <div className="space-y-5 animate-fade-in w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6">
          <div className="flex flex-col items-center sm:items-start max-w-2xl text-center sm:text-left">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary tracking-tight mb-2">
              {typeFilter === "Active"
                ? "Reference Follow-Ups"
                : typeFilter === "Lead"
                  ? "New Follow-Ups"
                  : "Follow-Ups"}
            </h2>
            <p className="text-xs md:text-sm text-textMuted font-medium leading-relaxed max-w-md">
              {typeFilter === "Active"
                ? "Manage communications with your reference clients."
                : typeFilter === "Lead"
                  ? "Track interactions with your new follow-ups."
                  : "Stay on top of your client and lead communications."}
            </p>
          </div>
          <div className="w-full sm:w-auto flex justify-center sm:justify-end shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2.5 px-6 py-3 bg-primary text-white rounded-xl hover:bg-slate-800 transition-all text-[11px] font-black tracking-[0.15em] shadow-xl hover:shadow-primary/20 active:scale-95 group uppercase"
            >
              <Plus
                size={16}
                strokeWidth={3}
                className="group-hover:rotate-90 transition-transform"
              />
              Add Follow-Up
            </button>
          </div>
        </div>

        {/* Control Bar: Search + Category Dropdown */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center lg:justify-between gap-2 w-full">
            <div className="relative w-full lg:max-w-xs min-w-0">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search follow-ups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:border-secondary transition-all"
              />
            </div>

            {/* Date Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Calendar
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold focus:outline-none focus:ring-2 focus:ring-secondary/10 transition-all text-primary"
                  title="Start Date"
                />
              </div>
              <span className="text-slate-300 font-bold text-[10px]">to</span>
              <div className="relative">
                <Calendar
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold focus:outline-none focus:ring-2 focus:ring-secondary/10 transition-all text-primary"
                  title="End Date"
                />
              </div>
              {(startDate || endDate) && (
                <button
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="p-2 text-slate-400 hover:text-error transition-colors"
                  title="Clear Dates"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
              <div className="relative flex-1 lg:flex-none">
                <button
                  onClick={() =>
                    setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                  }
                  className="w-full flex items-center justify-between gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold  tracking-widest text-[#18254D] hover:bg-white hover:border-slate-200 transition-all min-w-[160px] shadow-sm shadow-slate-200/50 group"
                >
                  <span>
                    {categoryFilter === "All"
                      ? "All Categories"
                      : categoryFilter}
                  </span>
                  <ChevronDown
                    size={16}
                    strokeWidth={2.5}
                    className={`transition-transform duration-300 ${isCategoryDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isCategoryDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[80]"
                      onClick={() => setIsCategoryDropdownOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden z-[90] animate-fade-in-up origin-top">
                      {["All", "Tech", "Media"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setCategoryFilter(cat);
                            setIsCategoryDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-[10px] font-bold  tracking-wider transition-colors ${
                            cat === "All"
                              ? "bg-[#18254D] text-white"
                              : categoryFilter === cat
                                ? "bg-slate-100 text-[#18254D]"
                                : "text-[#18254D] hover:bg-slate-50"
                          }`}
                        >
                          {cat === "All" ? "All Categories" : cat}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center my-4 overflow-x-auto">
          <div className="flex w-full md:inline-flex md:w-auto bg-slate-100/50 p-1 rounded-2xl border border-slate-200 shadow-sm leading-none h-[42px] items-center gap-1 whitespace-nowrap">
            {["All", "Overdue", "Today", "Upcoming"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`flex-1 md:flex-none px-2 md:px-5 h-full rounded-xl text-[9px] md:text-[10px] font-bold  tracking-wider transition-all flex items-center justify-center gap-1 md:gap-1.5 md:min-w-[100px] border border-transparent whitespace-nowrap ${activeFilter === f ? "bg-white text-primary shadow-md border-slate-100" : "text-slate-400 hover:text-slate-600 hover:bg-white/50"}`}
              >
                {f}
                <span
                  className={`text-[8px] md:text-[9px] font-bold min-w-[16px] md:min-w-[18px] h-[16px] md:h-[18px] flex items-center justify-center rounded-full ${activeFilter === f ? "bg-primary text-white" : "bg-slate-200 text-slate-500"}`}
                >
                  {tabCounts[f]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          {filteredFollowUps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm w-full">
              <Bell size={24} className="text-slate-100 mb-3" />
              <p className="text-[11px] font-bold text-primary  tracking-wider">
                No Active Tasks
              </p>
            </div>
          ) : (
            filteredFollowUps.map((f) => {
              const client = getClientById(f.clientId);
              const overdue = isOverdue(f.dueDate) && f.status === "pending";
              return (
                <div
                  key={f.id}
                  className={`group bg-white rounded-xl border transition-all hover:shadow-md flex flex-col md:flex-row items-start p-3 gap-3 ${f.status === "completed" ? "opacity-50 grayscale" : overdue ? "border-error/20 bg-error/[0.01]" : "border-slate-200 hover:border-secondary/30"}`}
                >
                  <button
                    onClick={() => {
                      if (f.status === "completed") {
                        onToggleStatus(f.id);
                      } else {
                        setCompletingFollowUpId(f.id);
                        setCompletionBrief("");
                        setShowCompletionModal(true);
                      }
                    }}
                    className={`w-8 h-8 rounded-lg border-2 transition-all flex items-center justify-center shrink-0 mt-1 ${f.status === "completed" ? "bg-success border-success text-white" : "bg-white border-slate-100 text-transparent hover:border-secondary"}`}
                  >
                    {f.status === "completed" ? (
                      <Check size={16} strokeWidth={4} />
                    ) : (
                      <CheckCircle2 size={14} strokeWidth={3} />
                    )}
                  </button>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[9px] font-bold  tracking-wider border ${getPriorityBadge(f.priority)}`}
                      >
                        {f.priority}
                      </span>
                      {f.followup_mode && (
                        <span className="px-2.5 py-0.5 rounded-md text-[9px] font-bold  tracking-wider border border-slate-200 bg-slate-50 text-slate-500">
                          {f.followup_mode}
                        </span>
                      )}
                      {overdue && (
                        <span className="text-[9px] font-bold  tracking-wider text-error bg-error/10 px-2.5 py-0.5 rounded-md border border-error/20">
                          Overdue
                        </span>
                      )}
                    </div>
                    <h4
                      className={`text-sm font-bold text-primary tracking-tight ${f.status === "completed" ? "line-through opacity-50" : ""}`}
                    >
                      {f.title}
                    </h4>
                    {f.description && (
                      <p className="text-[11px] text-slate-400 font-medium mt-1 line-clamp-2">
                        {f.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                      <div className="flex items-center gap-1.5 text-[10px] text-textMuted font-bold  tracking-widest">
                        <Clock size={12} className="text-secondary" />
                        {new Date(f.dueDate).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      {f.projectName && (
                        <div className="flex items-center gap-1.5 text-[10px] text-textMuted font-bold  tracking-widest">
                          <span className="text-secondary">•</span>
                          {f.projectName}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-[10px] text-textMuted font-bold  tracking-widest">
                        <span className="text-secondary">•</span>
                        {client?.name}
                      </div>
                    </div>
                    {f.status === "completed" && f.follow_brief && (
                      <div className="mt-2 px-3 py-2 bg-success/5 border border-success/20 rounded-lg">
                        <p className="text-[10px] font-bold text-success  tracking-wider mb-0.5">
                          Conclusion
                        </p>
                        <p className="text-[11px] text-slate-600 font-medium">
                          {f.follow_brief}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData({
                          ...f,
                          followup_date: f.dueDate
                            ? new Date(f.dueDate).toISOString().split("T")[0]
                            : f.followup_date ||
                              new Date().toISOString().split("T")[0],
                        });
                        setShowAddModal(true);
                      }}
                      className="p-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-primary transition-all active:scale-90 hover:shadow-sm"
                      title="Edit Follow-up"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteFollowUp && onDeleteFollowUp(f.id);
                      }}
                      className="p-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-error hover:border-error/30 transition-all active:scale-90 hover:shadow-sm"
                      title="Delete Follow-up"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Completion Brief Modal */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[9999] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in relative z-[10000]">
              <div className="bg-primary p-4 text-white relative">
                <button
                  onClick={() => {
                    setShowCompletionModal(false);
                    setCompletingFollowUpId(null);
                    setCompletionBrief("");
                  }}
                  className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X size={18} strokeWidth={3} />
                </button>
                <div className="flex items-center gap-3 pr-8">
                  <div className="w-8 h-8 bg-secondary/20 rounded-xl flex items-center justify-center border border-secondary/30">
                    <CheckCircle2
                      size={18}
                      strokeWidth={3}
                      className="text-secondary"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold tracking-tighter leading-none">
                      Mark as Completed
                    </h3>
                    <p className="text-secondary text-[9px] font-bold  tracking-widest mt-0.5">
                      Follow-up Conclusion
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-primary  tracking-widest ml-1">
                    Conclusion Brief
                  </label>
                  <textarea
                    autoFocus
                    placeholder="Write a brief conclusion about this follow-up..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium shadow-sm focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none resize-none"
                    value={completionBrief}
                    onChange={(e) => setCompletionBrief(e.target.value)}
                    rows="3"
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (completingFollowUpId) {
                        onToggleStatus(completingFollowUpId, completionBrief);
                      }
                      setShowCompletionModal(false);
                      setCompletingFollowUpId(null);
                      setCompletionBrief("");
                    }}
                    className="w-full py-3 bg-[#18254D] text-white rounded-xl text-[11px] font-bold  tracking-[0.25em] shadow-xl active:scale-[0.97] transition-all hover:bg-[#1e2e5e] hover:shadow-2xl flex items-center justify-center gap-3"
                  >
                    Complete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in my-auto">
            <div className="bg-primary p-4 text-white relative">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({
                    clientId: "",
                    title: "",
                    description: "",
                    followup_date: new Date().toISOString().split("T")[0],
                    followup_mode: "call",
                    followup_status: "pending",
                    follow_brief: "",
                    priority: "Medium",
                  });
                }}
                className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X size={18} strokeWidth={3} />
              </button>
              <h3 className="text-base font-bold tracking-tighter mb-0.5">
                {formData.id ? "Edit Follow Up" : "Add Follow Up"}
              </h3>
              <p className="text-slate-400 text-[9px] font-bold  tracking-widest">
                {formData.id
                  ? "Update follow-up details"
                  : "Create a new follow-up task"}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-3">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-primary  tracking-widest ml-1">
                    {typeFilter === "Active"
                      ? "Client Name"
                      : typeFilter === "Lead"
                        ? "Lead Name"
                        : "Target Identity"}
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setIsClientDropdownOpen(!isClientDropdownOpen)
                      }
                      className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium shadow-sm hover:border-secondary transition-all"
                    >
                      <span className="text-primary truncate max-w-[90%]">
                        {formData.clientId
                          ? clients.find((c) => c.id === formData.clientId)
                              ?.name
                          : typeFilter === "Active"
                            ? "Select a client..."
                            : typeFilter === "Lead"
                              ? "Select a lead..."
                              : "Select a client or lead..."}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-slate-400 transition-transform flex-shrink-0 ${isClientDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isClientDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-[80]"
                          onClick={() => setIsClientDropdownOpen(false)}
                        />
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden z-[90] animate-fade-in-up origin-top max-h-60 overflow-y-auto">
                          <div className="sticky top-0 bg-[#18254D] px-4 py-3 border-b border-white/10 z-10">
                            <p className="text-[9px] font-bold text-white/50  tracking-widest">
                              Select Client
                            </p>
                          </div>
                          {clients.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, clientId: c.id });
                                setIsClientDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-[10px] font-bold  tracking-widest transition-colors ${
                                formData.clientId === c.id
                                  ? "bg-slate-100 text-secondary"
                                  : "text-[#18254D] hover:bg-slate-50"
                              }`}
                            >
                              {c.name}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {typeFilter === "Active" && (
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-primary  tracking-widest ml-1">
                      Project Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Website Redesign"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium shadow-sm focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none"
                      value={formData.projectName || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          projectName: e.target.value,
                        })
                      }
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-primary  tracking-widest ml-1">
                    Task Title
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Discuss project scope"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium shadow-sm focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-primary  tracking-widest ml-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Add details about your follow-up..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium shadow-sm focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none resize-none"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-primary  tracking-widest ml-1">
                      Follow-up Date
                    </label>
                    <input
                      required
                      type="date"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium shadow-sm focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none text-[#18254D]"
                      value={formData.followup_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          followup_date: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-primary  tracking-widest ml-1">
                      Follow-up Mode
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setIsModeDropdownOpen(!isModeDropdownOpen)
                        }
                        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold shadow-sm hover:border-secondary transition-all"
                      >
                        <span className="text-primary capitalize">
                          {formData.followup_mode}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`text-slate-400 transition-transform ${isModeDropdownOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      {isModeDropdownOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-[80]"
                            onClick={() => setIsModeDropdownOpen(false)}
                          />
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden z-[90] animate-fade-in-up origin-top">
                            <div className="bg-[#18254D] px-4 py-3 border-b border-white/10">
                              <p className="text-[9px] font-bold text-white/50  tracking-widest">
                                Select Mode
                              </p>
                            </div>
                            {["call", "email", "meeting", "whatsapp"].map(
                              (mode) => (
                                <button
                                  key={mode}
                                  type="button"
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      followup_mode: mode,
                                    });
                                    setIsModeDropdownOpen(false);
                                  }}
                                  className={`w-full text-left px-4 py-2.5 text-[10px] font-bold  tracking-widest transition-colors capitalize ${
                                    formData.followup_mode === mode
                                      ? "bg-slate-100 text-secondary"
                                      : "text-[#18254D] hover:bg-slate-50"
                                  }`}
                                >
                                  {mode}
                                </button>
                              ),
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-primary  tracking-widest ml-1">
                    Follow-up Status
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setIsStatusDropdownOpen(!isStatusDropdownOpen)
                      }
                      className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold shadow-sm hover:border-secondary transition-all"
                    >
                      <span className="text-primary capitalize">
                        {formData.followup_status}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-slate-400 transition-transform ${isStatusDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isStatusDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-[80]"
                          onClick={() => setIsStatusDropdownOpen(false)}
                        />
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden z-[90] animate-fade-in-up origin-top">
                          <div className="bg-[#18254D] px-4 py-3 border-b border-white/10">
                            <p className="text-[9px] font-bold text-white/50  tracking-widest">
                              Select Status
                            </p>
                          </div>
                          {[
                            "pending",
                            "completed",
                            "rescheduled",
                            "cancelled",
                          ].map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  followup_status: status,
                                });
                                setIsStatusDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-[10px] font-bold  tracking-widest transition-colors capitalize ${
                                formData.followup_status === status
                                  ? "bg-slate-100 text-secondary"
                                  : "text-[#18254D] hover:bg-slate-50"
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-primary  tracking-widest ml-1">
                    Brief Notes
                  </label>
                  <textarea
                    placeholder="Add any brief notes..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium shadow-sm focus:ring-4 focus:ring-secondary/10 focus:border-secondary focus:outline-none resize-none"
                    value={formData.follow_brief || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, follow_brief: e.target.value })
                    }
                    rows="2"
                  />
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#18254D] text-white rounded-xl text-[11px] font-bold  tracking-[0.25em] shadow-xl active:scale-[0.97] transition-all hover:bg-[#1e2e5e] hover:shadow-2xl flex items-center justify-center gap-3"
                >
                  {formData.id ? "Save Changes" : "Create Follow-up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowUpList;
