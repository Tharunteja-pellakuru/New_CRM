import React, { useState } from "react";
import {
  User,
  Lock,
  Save,
  Camera,
  Check,
  ChevronRight,
  Mail,
  Phone,
  Building2,
  Users,
  Plus,
  Trash2,
  Edit2,
  Bot,
  Key,
  Zap,
  X,
} from "lucide-react";
import anandImg from "../assets/Anand.png";
import openaiLogo from "../assets/openai_logo.png";
import geminiLogo from "../assets/gemini_logo.png";
import grokLogo from "../assets/grok_logo.png";
import anthropicLogo from "../assets/anthropic_logo.png";
import mistralLogo from "../assets/mistral_logo.png";
import deepseekLogo from "../assets/deepseek_logo.png";
import llamaLogo from "../assets/llama_logo.png";
import groqLogo from "../assets/groq_logo.png";

const Settings = ({
  aiModels = [],
  onAddAiModel,
  onUpdateAiModel,
  onDeleteAiModel,
}) => {
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState({
    name: "Anand",
    email: "root@parivartan.crm",
    phone: "+91 98765 43210",
    designation: "Root Administrator",
    avatar: anandImg,
  });

  const [isProfileSaved, setIsProfileSaved] = useState(false);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [aiSettings, setAiSettings] = useState({
    provider: "chatgpt",
    apiKey: "",
    blockedKeywords: "",
    restrictedInstructions: "",
    guardPrompt: "",
  });
  const [isAiSaved, setIsAiSaved] = useState(false);
  const [isAiEditing, setIsAiEditing] = useState(false);

  // AI Model management state
  const [showAddModelForm, setShowAddModelForm] = useState(false);
  const [newModel, setNewModel] = useState({
    name: "",
    provider: "openai",
    modelId: "",
    apiKey: "",
  });
  const [editingModelId, setEditingModelId] = useState(null);
  const [editModelData, setEditModelData] = useState({});

  const [admins, setAdmins] = useState([
    {
      id: "2",
      name: "Chaitanya",
      email: "chaitanya@parivartan.crm",
      role: "Manager",
      status: "Active",
      privileges: "Tech",
      joinDate: "2024-02-10",
    },
    {
      id: "3",
      name: "Priya",
      email: "priya@parivartan.crm",
      role: "Admin",
      status: "Active",
      privileges: "Media",
      joinDate: "2024-03-05",
    },
  ]);

  const [showAddAdminForm, setShowAddAdminForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    role: "Admin",
    status: "Active",
    privileges: "Both",
  });
  const [editingAdminId, setEditingAdminId] = useState(null);
  const [editAdminData, setEditAdminData] = useState({
    name: "",
    email: "",
    role: "Admin",
    status: "Active",
    privileges: "Both",
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isPasswordSaved, setIsPasswordSaved] = useState(false);

  const handleProfileSave = () => {
    setIsProfileSaved(true);
    setIsProfileEditing(false);
    setTimeout(() => setIsProfileSaved(false), 3000);
  };
  const handleAiSettingsSave = () => {
    setIsAiSaved(true);
    setIsAiEditing(false);
    setTimeout(() => setIsAiSaved(false), 3000);
  };

  const handleAddAdmin = () => {
    if (newAdmin.name && newAdmin.email) {
      const admin = {
        id: String(admins.length + 1),
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        status: newAdmin.status,
        privileges: newAdmin.privileges,
        joinDate: new Date().toISOString().split("T")[0],
      };
      setAdmins([...admins, admin]);
      setNewAdmin({
        name: "",
        email: "",
        role: "Admin",
        status: "Active",
        privileges: "Both",
      });
      setShowAddAdminForm(false);
    }
  };

  const handleDeleteAdmin = (id) => {
    if (id !== "1") {
      setAdmins(admins.filter((admin) => admin.id !== id));
    }
  };

  const handleStartEditAdmin = (admin) => {
    setEditingAdminId(admin.id);
    setEditAdminData({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      status: admin.status,
      privileges: admin.privileges || "Both",
    });
  };

  const handleCancelEditAdmin = () => {
    setEditingAdminId(null);
    setEditAdminData({
      name: "",
      email: "",
      role: "Admin",
      status: "Active",
      privileges: "Both",
    });
  };

  const handleSaveEditAdmin = (id) => {
    if (!editAdminData.name || !editAdminData.email) return;
    setAdmins(
      admins.map((admin) =>
        admin.id === id
          ? {
            ...admin,
            name: editAdminData.name,
            email: editAdminData.email,
            role: editAdminData.role,
            status: editAdminData.status,
            privileges: editAdminData.privileges,
          }
          : admin,
      ),
    );
    handleCancelEditAdmin();
  };

  const handleUpdatePassword = () => {
    if (
      passwordData.currentPassword &&
      passwordData.newPassword &&
      passwordData.confirmPassword
    ) {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert("New passwords do not match");
        return;
      }
      setIsPasswordSaved(true);
      setTimeout(() => {
        setIsPasswordSaved(false);
        setShowPasswordForm(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }, 3000);
    }
  };

  return (
    <div className="w-full relative">
      <div className="space-y-5 animate-fade-in w-full">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="max-w-2xl">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-primary tracking-tight mb-2">
              Settings
            </h2>
            <p className="text-sm text-textMuted font-medium leading-relaxed">
              Manage your profile, AI, security, and team settings.
            </p>
          </div>
        </div>

        {/* Top Navigation Tabs */}
        <div className="flex justify-start my-4 overflow-x-auto no-scrollbar pb-1">
          <div className="inline-flex bg-slate-100/50 p-1 rounded-2xl border border-slate-200 shadow-sm leading-none h-[42px] items-center gap-1 whitespace-nowrap">
            {[
              { id: "profile", label: "My Profile" },
              { id: "security", label: "Security" },
              { id: "ai", label: "AI Settings" },
              { id: "team", label: "Team & Admins" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 h-full rounded-xl text-[10px] font-bold  tracking-wider transition-all flex items-center justify-center min-w-[100px] border border-transparent whitespace-nowrap ${activeTab === tab.id
                    ? "bg-white text-blue-600 shadow-md border-blue-50"
                    : "text-slate-400 hover:text-slate-500 hover:bg-white/50"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full">
          <div className="bg-white rounded-[20px] p-6 md:p-8 lg:p-10 border border-slate-200/60 shadow-sm w-full">
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="space-y-8 animate-fade-in w-full">
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-slate-100">
                  <div className="relative group shrink-0">
                    <label
                      htmlFor="profile-photo-upload"
                      className={`block ${isProfileEditing ? "cursor-pointer" : "cursor-default"}`}
                    >
                      <img
                        src={profile.avatar}
                        alt="Profile"
                        className="w-24 h-24 rounded-2xl border-4 border-slate-100 object-cover shadow-md group-hover:shadow-lg transition-shadow"
                      />
                      {isProfileEditing && (
                        <div className="absolute inset-0 bg-[#18254D]/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="text-white" size={24} />
                        </div>
                      )}
                    </label>
                    <input
                      type="file"
                      id="profile-photo-upload"
                      accept="image/*"
                      className="hidden"
                      disabled={!isProfileEditing}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setProfile((prev) => ({
                              ...prev,
                              avatar: reader.result,
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                  <div className="text-center sm:text-left pt-2">
                    <h3 className="text-2xl font-bold text-primary mb-1 tracking-tight">
                      {profile.name}
                    </h3>
                    <p className="text-sm text-slate-500 font-bold mb-3">
                      {profile.designation}
                    </p>
                    <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-md text-[10px]  font-bold tracking-widest">
                      Administrator
                    </span>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[10px] font-bold text-slate-400  tracking-[0.2em] ml-1">
                        Basic Information
                      </h4>
                      <button
                        onClick={() => setIsProfileEditing(!isProfileEditing)}
                        className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-primary hover:border-primary/40 hover:bg-slate-50 transition-all"
                        title="Edit profile"
                        aria-label="Edit profile"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400  tracking-widest ml-1 flex items-center gap-2">
                          <User size={12} className="text-slate-400" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) =>
                            setProfile({ ...profile, name: e.target.value })
                          }
                          disabled={!isProfileEditing}
                          className={`w-full px-4 py-3 border border-slate-100 rounded-xl transition-all text-sm font-bold ${isProfileEditing
                              ? "bg-slate-50 focus:ring-2 focus:ring-secondary/30 focus:border-secondary focus:outline-none text-[#18254D]"
                              : "bg-slate-50 border-slate-100 text-[#18254D] cursor-not-allowed opacity-80"
                            }`}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400  tracking-widest ml-1 flex items-center gap-2">
                          <Building2 size={12} className="text-slate-400" />
                          Designation
                        </label>
                        <input
                          type="text"
                          value={profile.designation}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              designation: e.target.value,
                            })
                          }
                          disabled={!isProfileEditing}
                          className={`w-full px-4 py-3 border border-slate-100 rounded-xl transition-all text-sm font-bold ${isProfileEditing
                              ? "bg-slate-50 focus:ring-2 focus:ring-secondary/30 focus:border-secondary focus:outline-none text-[#18254D]"
                              : "bg-slate-50 border-slate-100 text-[#18254D] cursor-not-allowed opacity-80"
                            }`}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400  tracking-widest ml-1 flex items-center gap-2">
                          <Mail size={12} className="text-slate-400" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profile.email}
                          readOnly
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 cursor-not-allowed opacity-80 text-sm font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400  tracking-widest ml-1 flex items-center gap-2">
                          <Phone size={12} className="text-slate-400" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) =>
                            setProfile({ ...profile, phone: e.target.value })
                          }
                          disabled={!isProfileEditing}
                          className={`w-full px-4 py-3 border border-slate-100 rounded-xl transition-all text-sm font-bold ${isProfileEditing
                              ? "bg-slate-50 focus:ring-2 focus:ring-secondary/30 focus:border-secondary focus:outline-none text-[#18254D]"
                              : "bg-slate-50 border-slate-100 text-[#18254D] cursor-not-allowed opacity-80"
                            }`}
                        />
                      </div>
                    </div>
                  </div>

                  {isProfileEditing && (
                    <div className="flex justify-end pt-5 border-t border-slate-100">
                      <button
                        onClick={handleProfileSave}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-slate-800 transition-all active:scale-95 text-xs  tracking-widest font-bold"
                      >
                        {isProfileSaved ? (
                          <>
                            <Check size={16} />
                            Saved
                          </>
                        ) : (
                          <>
                            <Save size={16} />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AI SETTINGS TAB */}
            {activeTab === "ai" && (
              <div className="space-y-8 animate-fade-in w-full">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-primary mb-2 tracking-tight">
                      AI Integration Settings
                    </h3>
                    <p className="text-sm text-slate-500 font-bold">
                      Manage AI models for enquiry filtering and analysis.
                    </p>
                  </div>
                </div>

                {/* AI Models Management Section */}
                <div className="pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-[10px] font-bold text-primary  tracking-[0.2em] flex items-center gap-2">
                        <Bot size={14} className="text-violet-500" />
                        AI Models ({aiModels.length})
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 font-bold">
                        Add and manage AI models for enquiry filtering and other
                        features.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddModelForm(!showAddModelForm)}
                      className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-slate-800 transition-all active:scale-95 text-xs font-bold  tracking-widest"
                    >
                      <Plus size={16} />
                      Add AI Model
                    </button>
                  </div>

                  {/* Add Model Form */}
                  {showAddModelForm && (
                    <div className="p-6 bg-violet-50/50 border border-violet-200 rounded-2xl space-y-5 mb-6 animate-fade-in">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2 tracking-tight">
                        <Zap size={16} className="text-violet-500" />
                        Add New AI Model
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-[10px]  font-bold text-slate-500 tracking-widest">
                            Display Name
                          </label>
                          <input
                            type="text"
                            value={newModel.name}
                            onChange={(e) =>
                              setNewModel({ ...newModel, name: e.target.value })
                            }
                            placeholder="e.g., GPT-4o Mini"
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none transition-all text-sm font-bold"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px]  font-bold text-slate-500 tracking-widest">
                            Provider
                          </label>
                          <select
                            value={newModel.provider}
                            onChange={(e) =>
                              setNewModel({
                                ...newModel,
                                provider: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none transition-all text-sm font-bold"
                          >
                            <option value="openai">OpenAI (ChatGPT)</option>
                            <option value="gemini">Google Gemini</option>
                            <option value="grok">xAI (Grok)</option>
                            <option value="anthropic">
                              Anthropic (Claude)
                            </option>
                            <option value="mistral">Mistral AI</option>
                            <option value="deepseek">DeepSeek</option>
                            <option value="llama">Meta Llama (Groq)</option>
                            <option value="groq">Groq (Ultra Fast)</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px]  font-bold text-slate-500 tracking-widest">
                            Model ID (exact)
                          </label>
                          <input
                            type="text"
                            value={newModel.modelId}
                            onChange={(e) =>
                              setNewModel({
                                ...newModel,
                                modelId: e.target.value,
                              })
                            }
                            placeholder="e.g., gpt-4o-mini, grok-2, claude-3-haiku"
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none transition-all text-sm font-bold"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px]  font-bold text-slate-500 tracking-widest flex items-center gap-1.5">
                            <Key size={12} className="text-slate-400" />
                            API Key
                          </label>
                          <input
                            type="password"
                            value={newModel.apiKey}
                            onChange={(e) =>
                              setNewModel({
                                ...newModel,
                                apiKey: e.target.value,
                              })
                            }
                            placeholder="Enter API key for this model"
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none transition-all text-sm font-bold"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-3">
                        <button
                          onClick={() => {
                            if (
                              newModel.name &&
                              newModel.modelId &&
                              newModel.apiKey
                            ) {
                              onAddAiModel(newModel);
                              setNewModel({
                                name: "",
                                provider: "openai",
                                modelId: "",
                                apiKey: "",
                              });
                              setShowAddModelForm(false);
                            }
                          }}
                          disabled={
                            !newModel.name ||
                            !newModel.modelId ||
                            !newModel.apiKey
                          }
                          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-slate-800 transition-all active:scale-95 text-xs font-bold  tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Check size={16} />
                          Add Model
                        </button>
                        <button
                          onClick={() => setShowAddModelForm(false)}
                          className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all text-xs font-bold  tracking-widest"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Models List */}
                  <div className="space-y-3">
                    {aiModels.map((model) => {
                      const providerLabels = {
                        openai: {
                          label: "OpenAI",
                          color: "bg-emerald-100 text-emerald-700",
                          logo: openaiLogo,
                        },
                        gemini: {
                          label: "Google Gemini",
                          color: "bg-blue-100 text-blue-700",
                          logo: geminiLogo,
                        },
                        grok: {
                          label: "xAI Grok",
                          color: "bg-orange-100 text-orange-700",
                          logo: grokLogo,
                        },
                        anthropic: {
                          label: "Anthropic",
                          color: "bg-amber-100 text-amber-700",
                          logo: anthropicLogo,
                        },
                        mistral: {
                          label: "Mistral",
                          color: "bg-cyan-100 text-cyan-700",
                          logo: mistralLogo,
                        },
                        deepseek: {
                          label: "DeepSeek",
                          color: "bg-indigo-100 text-indigo-700",
                          logo: deepseekLogo,
                        },
                        llama: {
                          label: "Llama 3 (Groq)",
                          color: "bg-orange-100/20 text-orange-800",
                          logo: llamaLogo,
                        },
                        groq: {
                          label: "Groq (Ultra Fast)",
                          color: "bg-orange-500/10 text-orange-600",
                          logo: groqLogo,
                        },
                        other: {
                          label: "Other",
                          color: "bg-slate-100 text-slate-700",
                          logo: null,
                        },
                      };
                      const prov =
                        providerLabels[model.provider] || providerLabels.other;

                      return (
                        <div
                          key={model.id}
                          className="p-4 bg-white border border-slate-200 rounded-xl hover:border-violet-200 hover:shadow-md transition-all"
                        >
                          {editingModelId === model.id ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                  <label className="text-[10px]  font-bold text-slate-500 tracking-widest">
                                    Display Name
                                  </label>
                                  <input
                                    type="text"
                                    value={editModelData.name}
                                    onChange={(e) =>
                                      setEditModelData({
                                        ...editModelData,
                                        name: e.target.value,
                                      })
                                    }
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none transition-all text-sm font-bold"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px]  font-bold text-slate-500 tracking-widest">
                                    Provider
                                  </label>
                                  <select
                                    value={editModelData.provider}
                                    onChange={(e) =>
                                      setEditModelData({
                                        ...editModelData,
                                        provider: e.target.value,
                                      })
                                    }
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none transition-all text-sm font-bold"
                                  >
                                    <option value="openai">
                                      OpenAI (ChatGPT)
                                    </option>
                                    <option value="gemini">
                                      Google Gemini
                                    </option>
                                    <option value="grok">xAI (Grok)</option>
                                    <option value="anthropic">
                                      Anthropic (Claude)
                                    </option>
                                    <option value="mistral">Mistral AI</option>
                                    <option value="deepseek">DeepSeek</option>
                                    <option value="llama">Llama 3 (Groq)</option>
                                    <option value="groq">Groq (Ultra Fast)</option>
                                    <option value="other">Other</option>
                                  </select>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px]  font-bold text-slate-500 tracking-widest">
                                    Model ID
                                  </label>
                                  <input
                                    type="text"
                                    value={editModelData.modelId}
                                    onChange={(e) =>
                                      setEditModelData({
                                        ...editModelData,
                                        modelId: e.target.value,
                                      })
                                    }
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none transition-all text-sm font-bold"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px]  font-bold text-slate-500 tracking-widest">
                                    API Key
                                  </label>
                                  <input
                                    type="password"
                                    value={editModelData.apiKey}
                                    onChange={(e) =>
                                      setEditModelData({
                                        ...editModelData,
                                        apiKey: e.target.value,
                                      })
                                    }
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none transition-all text-sm font-bold"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-3 pt-2">
                                <button
                                  onClick={() => {
                                    onUpdateAiModel(editModelData);
                                    setEditingModelId(null);
                                  }}
                                  className="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-slate-800 transition-all text-xs font-bold  tracking-widest"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingModelId(null)}
                                  className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all text-xs font-bold  tracking-widest"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                  {prov.logo ? (
                                    <img src={prov.logo} alt={prov.label} className="w-full h-full object-cover" />
                                  ) : (
                                    <Bot size={18} className="text-violet-600" />
                                  )}
                                </div>
                                <div>
                                  <h5 className="font-bold text-slate-900 flex items-center gap-2">
                                    {model.name}
                                    {model.isDefault && (
                                      <span className="text-[8px] px-2 py-0.5 bg-primary text-white rounded-full font-bold  tracking-widest">
                                        Default
                                      </span>
                                    )}
                                  </h5>
                                  <p className="text-[11px] text-slate-400 font-mono font-bold">
                                    {model.modelId}
                                  </p>
                                </div>
                                <div className="flex items-center">
                                {/* Chips removed for cleaner look as requested */}
                              </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setEditingModelId(model.id);
                                    setEditModelData({ ...model });
                                  }}
                                  className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-primary"
                                  title="Edit model"
                                >
                                  <Edit2 size={16} />
                                </button>
                                {!model.isDefault && (
                                  <button
                                    onClick={() => onDeleteAiModel(model.id)}
                                    className="p-2 hover:bg-red-50 rounded-xl transition-all text-slate-400 hover:text-red-500"
                                    title="Delete model"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100 hidden">
                  <button
                    onClick={handleAiSettingsSave}
                    disabled={!isAiEditing}
                    className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold  tracking-widest transition-all ${isAiEditing
                        ? "bg-primary text-white hover:bg-slate-800 active:scale-95"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                  >
                    {isAiSaved ? (
                      <>
                        <Check size={16} />
                        Saved
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save AI Settings
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
            {/* SECURITY TAB */}
            {activeTab === "security" && (
              <div className="space-y-8 animate-fade-in w-full">
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-2 tracking-tight">
                    Security Settings
                  </h3>
                  <p className="text-sm text-slate-500 font-bold">
                    Manage your account security and access controls.
                  </p>
                </div>

                <div className="p-6 bg-slate-50 border border-slate-200/60 rounded-[20px]">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-4 tracking-tight">
                    Change Password
                  </h4>
                  {!showPasswordForm ? (
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      className="text-xs font-bold  tracking-widest text-slate-500 hover:text-primary transition-colors flex items-center gap-2"
                    >
                      <Lock size={14} />
                      Update Password
                    </button>
                  ) : (
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-[10px]  font-bold text-slate-500 tracking-widest">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          placeholder="Enter current password"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary/30 focus:border-secondary focus:outline-none transition-all text-sm font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px]  font-bold text-slate-500 tracking-widest">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          placeholder="Enter new password"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary/30 focus:border-secondary focus:outline-none transition-all text-sm font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px]  font-bold text-slate-500 tracking-widest">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          placeholder="Confirm new password"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary/30 focus:border-secondary focus:outline-none transition-all text-sm font-bold"
                        />
                      </div>
                      <div className="flex gap-3 pt-3">
                        <button
                          onClick={handleUpdatePassword}
                          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-slate-800 transition-all active:scale-95 text-xs font-bold  tracking-widest"
                        >
                          {isPasswordSaved ? (
                            <>
                              <Check size={16} />
                              Password Updated
                            </>
                          ) : (
                            <>
                              <Save size={16} />
                              Update Password
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setShowPasswordForm(false)}
                          className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all text-xs font-bold  tracking-widest"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TEAM & ADMINS TAB */}
            {activeTab === "team" && (
              <div className="space-y-8 animate-fade-in w-full">
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-2 tracking-tight">
                    Manage Team Members
                  </h3>
                  <p className="text-sm font-bold text-slate-500">
                    View and manage administrators and team members.
                  </p>
                  {/* Add Admin Button */}
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => setShowAddAdminForm(!showAddAdminForm)}
                      className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-slate-800 transition-all active:scale-95 text-xs font-bold  tracking-widest"
                    >
                      <Plus size={16} />
                      Add Admin
                    </button>
                  </div>
                </div>

                {/* Add Admin Form */}
                {showAddAdminForm && (
                  <div className="p-6 bg-slate-50 border border-slate-200/60 rounded-[20px] space-y-5">
                    <h4 className="font-bold text-slate-900 tracking-tight">
                      Add New Administrator
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                      <div className="space-y-2 lg:col-span-1">
                        <label className="text-[10px]  font-bold text-slate-500 tracking-widest">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={newAdmin.name}
                          onChange={(e) =>
                            setNewAdmin({ ...newAdmin, name: e.target.value })
                          }
                          placeholder="Enter full name"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary/30 focus:border-secondary focus:outline-none transition-all text-sm font-bold"
                        />
                      </div>
                      <div className="space-y-2 lg:col-span-1">
                        <label className="text-[10px]  font-bold text-slate-500 tracking-widest">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={newAdmin.email}
                          onChange={(e) =>
                            setNewAdmin({
                              ...newAdmin,
                              email: e.target.value,
                            })
                          }
                          placeholder="name@parivartan.crm"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary/30 focus:border-secondary focus:outline-none transition-all text-sm font-bold"
                        />
                      </div>
                      <div className="space-y-2 lg:col-span-1">
                        <label className="text-[10px]  font-bold text-slate-500 tracking-widest">
                          Role
                        </label>
                        <select
                          value={newAdmin.role}
                          onChange={(e) =>
                            setNewAdmin({ ...newAdmin, role: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary/30 focus:border-secondary focus:outline-none transition-all text-sm font-bold"
                        >
                          <option value="Admin">Admin</option>
                          <option value="Manager">Manager</option>
                          <option value="Moderator">Moderator</option>
                        </select>
                      </div>
                      <div className="space-y-2 lg:col-span-1">
                        <label className="text-[10px]  font-bold text-slate-500 tracking-widest">
                          Status
                        </label>
                        <select
                          value={newAdmin.status}
                          onChange={(e) =>
                            setNewAdmin({
                              ...newAdmin,
                              status: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary/30 focus:border-secondary focus:outline-none transition-all text-sm font-bold"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                      <div className="space-y-2 lg:col-span-1">
                        <label className="text-[10px]  font-bold text-slate-500 tracking-widest">
                          Privileges
                        </label>
                        <select
                          value={newAdmin.privileges}
                          onChange={(e) =>
                            setNewAdmin({
                              ...newAdmin,
                              privileges: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary/30 focus:border-secondary focus:outline-none transition-all text-sm font-bold"
                        >
                          <option value="Tech">Tech</option>
                          <option value="Media">Media</option>
                          <option value="Both">Both</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-3">
                      <button
                        onClick={handleAddAdmin}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-slate-800 active:scale-95 transition-all text-xs font-bold  tracking-widest"
                      >
                        <Check size={16} />
                        Add Admin
                      </button>
                      <button
                        onClick={() => setShowAddAdminForm(false)}
                        className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all text-xs font-bold  tracking-widest"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Admins List */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-primary  tracking-[0.2em] ml-1">
                    Current Administrators ({admins.length})
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    {admins.map((admin) => (
                      <div
                        key={admin.id}
                        className={`p-6 bg-white border border-slate-200/60 rounded-[20px] hover:border-secondary/30 hover:shadow-md transition-all ${editingAdminId === admin.id
                            ? "space-y-5"
                            : "flex items-center justify-between"
                          }`}
                      >
                        <div className="flex-1">
                          {editingAdminId === admin.id ? (
                            <div className="space-y-5">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                  <label className="text-[10px]  font-bold text-slate-500 tracking-widest">
                                    Full Name
                                  </label>
                                  <input
                                    type="text"
                                    value={editAdminData.name}
                                    onChange={(e) =>
                                      setEditAdminData({
                                        ...editAdminData,
                                        name: e.target.value,
                                      })
                                    }
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary/30 focus:border-secondary focus:outline-none transition-all text-sm font-bold"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px]  font-bold text-slate-500 tracking-widest">
                                    Email
                                  </label>
                                  <input
                                    type="email"
                                    value={editAdminData.email}
                                    onChange={(e) =>
                                      setEditAdminData({
                                        ...editAdminData,
                                        email: e.target.value,
                                      })
                                    }
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary/30 focus:border-secondary focus:outline-none transition-all text-sm font-bold"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px]  font-bold text-slate-500 tracking-widest">
                                    Role
                                  </label>
                                  <select
                                    value={editAdminData.role}
                                    onChange={(e) =>
                                      setEditAdminData({
                                        ...editAdminData,
                                        role: e.target.value,
                                      })
                                    }
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary/30 focus:border-secondary focus:outline-none transition-all text-sm font-bold"
                                  >
                                    <option value="Root Admin">
                                      Root Admin
                                    </option>
                                    <option value="Admin">Admin</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Moderator">Moderator</option>
                                  </select>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px]  font-bold text-slate-500 tracking-widest">
                                    Status
                                  </label>
                                  <select
                                    value={editAdminData.status}
                                    onChange={(e) =>
                                      setEditAdminData({
                                        ...editAdminData,
                                        status: e.target.value,
                                      })
                                    }
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary/30 focus:border-secondary focus:outline-none transition-all text-sm font-bold"
                                  >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                  </select>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px]  font-bold text-slate-500 tracking-widest">
                                    Privileges
                                  </label>
                                  <select
                                    value={editAdminData.privileges}
                                    onChange={(e) =>
                                      setEditAdminData({
                                        ...editAdminData,
                                        privileges: e.target.value,
                                      })
                                    }
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary/30 focus:border-secondary focus:outline-none transition-all text-sm font-bold"
                                  >
                                    <option value="Tech">Tech</option>
                                    <option value="Media">Media</option>
                                    <option value="Both">Both</option>
                                  </select>
                                </div>
                              </div>
                              <div className="flex gap-3 pt-2">
                                <button
                                  onClick={() => handleSaveEditAdmin(admin.id)}
                                  className="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-slate-800 transition-all text-xs font-bold  tracking-widest"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleCancelEditAdmin}
                                  className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all text-xs font-bold  tracking-widest"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-4 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                  <User size={18} className="text-primary" />
                                </div>
                                <div>
                                  <h5 className="font-bold text-slate-900 tracking-tight">
                                    {admin.name}
                                  </h5>
                                  <p className="text-[11px] font-bold text-slate-500">
                                    {admin.email}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-3 mt-4 ml-14">
                                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-bold  tracking-widest">
                                  {admin.role}
                                </span>
                                <span className="inline-block px-3 py-1 bg-green-100/50 border border-green-200 text-green-700 rounded-lg text-[10px] font-bold  tracking-widest">
                                  {admin.status}
                                </span>
                                <span className="inline-block px-3 py-1 bg-blue-100/50 border border-blue-200 text-blue-700 rounded-lg text-[10px] font-bold  tracking-widest">
                                  {admin.privileges || "Both"}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {editingAdminId !== admin.id && (
                            <>
                              <button
                                onClick={() => handleStartEditAdmin(admin)}
                                className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-primary"
                                title="Edit admin"
                                aria-label="Edit admin"
                              >
                                <Edit2 size={16} />
                              </button>
                              {admin.id !== "1" && (
                                <button
                                  onClick={() => handleDeleteAdmin(admin.id)}
                                  className="p-2 hover:bg-red-50 rounded-xl transition-all text-slate-400 hover:text-red-500"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
