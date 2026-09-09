import React, { useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Bot,
  BookOpen,
  HelpCircle,
  User,
  LogOut,
  Bell,
  Send,
} from "lucide-react";

/**
 * ── Static data ──────────────────────────────────────────────
 * Replace these with data fetched from your Spring Boot API
 * (e.g. GET /api/tickets/my-summary, GET /api/tickets/recent)
 * once the backend is ready. For now they let the page render
 * on its own.
 */
const stats = [
  { label: "Open Tickets", value: 3, color: "bg-violet-500" },
  { label: "In Progress", value: 2, color: "bg-blue-500" },
  { label: "Waiting for Feedback", value: 8, color: "bg-emerald-500" },
  { label: "Closed", value: 15, color: "bg-slate-400" },
];

const recentTickets = [
  {
    id: "#TKT-1024",
    issue: "VPN not connecting",
    category: "Network",
    priority: "High",
    status: "Open",
    created: "Today",
  },
  {
    id: "#TKT-1023",
    issue: "Phishing email reported",
    category: "Security",
    priority: "High",
    status: "In Progress",
    created: "Today",
  },
  {
    id: "#TKT-1024",
    issue: "VPN not connecting",
    category: "Network",
    priority: "High",
    status: "Resolved",
    created: "Today",
  },
  {
    id: "#TKT-1024",
    issue: "Database connectivity issue",
    category: "Database",
    priority: "High",
    status: "Resolved",
    created: "Yesterday",
  },
];

const knowledgeArticles = [
  "How to reset your password",
  "VPN connection troubleshooting",
  "Setting up your office printer",
];

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "My Request", icon: ClipboardList },
  { label: "Raise Request", icon: PlusCircle },
  { label: "AI Support", icon: Bot },
  { label: "Knowledge Base", icon: BookOpen },
];

const statusStyles = {
  Open: "bg-violet-100 text-violet-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Resolved: "bg-emerald-100 text-emerald-700",
};

/** Small pill used inside the tickets table */
function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
        statusStyles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

/** Left navigation rail */
function Sidebar() {
  return (
    <aside className="flex h-full w-60 flex-col justify-between border-r border-slate-200 bg-white px-4 py-6">
      <div>
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-lg font-bold text-white">
            A
          </div>
          <div>
            <p className="text-base font-bold leading-tight text-slate-900">
              ASSISTIFY
            </p>
            <p className="text-[11px] leading-tight text-slate-400">
              Intelligent IT Service Desk
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-violet-100 text-violet-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-1 border-t border-slate-100 pt-4">
        <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
          <HelpCircle size={18} />
          Help / Support
        </button>
        <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
          <User size={18} />
          User Profile
        </button>
        <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

/** One of the four top summary cards */
function StatCard({ label, value, color }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4">
      <span className={`h-8 w-1.5 rounded-full ${color}`} />
      <div>
        <p className="text-2xl font-bold text-slate-900">
          {String(value).padStart(2, "0")}
        </p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard({ employeeName = "Employee Name" }) {
  const [problem, setProblem] = useState("");

  const handleAskAi = () => {
    if (!problem.trim()) return;
    // TODO: wire this up to your AI Support endpoint, e.g.
    // POST /api/ai/ask { message: problem }
    console.log("Asking AI:", problem);
    setProblem("");
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Hi, {employeeName} how can we help you today?
          </h1>
          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-2 hover:bg-slate-100">
              <Bell size={20} className="text-slate-500" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-500">
              <User size={18} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          {/* ── Left / main column ── */}
          <div className="flex flex-col gap-6">
            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>

            {/* Ask AI box */}
            <div className="rounded-xl border border-violet-100 bg-white p-6">
              <div className="mb-1 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                  <Bot size={18} />
                </div>
                <h2 className="text-lg font-semibold">
                  How can we help you today?
                </h2>
              </div>
              <p className="mb-4 pl-12 text-sm text-slate-500">
                Describe your problem and Assistify will help you before you
                raise a service request
              </p>

              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Describe your problem (e.g.. CR, incident, etc)..."
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />

              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleAskAi}
                  className="flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
                >
                  <Send size={16} />
                  Ask AI
                </button>
              </div>
            </div>

            {/* Recent tickets table */}
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex items-center justify-end">
                <button className="text-sm font-medium text-violet-600 hover:underline">
                  View all tickets
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400">
                      <th className="pb-3 font-medium">Ticket ID</th>
                      <th className="pb-3 font-medium">Issue</th>
                      <th className="pb-3 font-medium">Category</th>
                      <th className="pb-3 font-medium">Priority</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Created</th>
                      <th className="pb-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTickets.map((t, i) => (
                      <tr key={i} className="border-b border-slate-50 last:border-0">
                        <td className="py-3 font-medium text-slate-700">{t.id}</td>
                        <td className="py-3 text-slate-600">{t.issue}</td>
                        <td className="py-3 text-slate-600">{t.category}</td>
                        <td className="py-3 text-slate-600">{t.priority}</td>
                        <td className="py-3">
                          <StatusBadge status={t.status} />
                        </td>
                        <td className="py-3 text-slate-500">{t.created}</td>
                        <td className="py-3">
                          <button className="font-medium text-violet-600 hover:underline">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="mb-2 text-sm font-semibold text-slate-800">
                  Having an IT problem?
                </p>
                <p className="mb-4 text-xs text-slate-500">
                  Raise a support ticket and our IT team will help you.
                </p>
                <button className="w-full rounded-full bg-violet-600 py-2 text-xs font-medium text-white hover:bg-violet-700">
                  + Raise Request
                </button>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="mb-2 text-sm font-semibold text-slate-800">
                  Need Quick Help?
                </p>
                <p className="mb-4 text-xs text-slate-500">
                  Find troubleshooting steps or ask Assistify for help.
                </p>
                <button className="w-full rounded-full border border-violet-200 py-2 text-xs font-medium text-violet-600 hover:bg-violet-50">
                  Ask AI
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="mb-1 text-sm font-semibold text-slate-800">
                Knowledge Base
              </h3>
              <p className="mb-3 text-xs text-slate-500">
                Browse common IT solutions and troubleshooting guides.
              </p>
              <ul className="mb-4 list-disc space-y-1.5 pl-4 text-xs text-slate-600">
                {knowledgeArticles.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
              <button className="w-full rounded-full bg-violet-100 py-2 text-xs font-medium text-violet-700 hover:bg-violet-200">
                Browse Articles
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                  <HelpCircle size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Help / Support
                  </p>
                  <p className="text-xs text-slate-500">Need more assistance?</p>
                </div>
              </div>
              <button className="w-full rounded-full bg-violet-600 py-2 text-xs font-medium text-white hover:bg-violet-700">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}