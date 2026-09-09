/*function Dashboard() {
    return <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
}
export default Dashboard*/
import { Clock, CheckCircle2, Headphones, Send, Bell, UserCircle } from 'lucide-react'

const stats = [
    { label: 'Open Tickets', value: 1, color: 'border-purple-500', icon: Clock, iconColor: 'text-purple-500' },
    { label: 'In Progress', value: 1, color: 'border-blue-500', icon: CheckCircle2, iconColor: 'text-blue-500' },
    { label: 'Waiting for Feedback', value: 2, color: 'border-green-500', icon: CheckCircle2, iconColor: 'text-green-500' },
    { label: 'Closed', value: 0, color: 'border-gray-400', icon: CheckCircle2, iconColor: 'text-gray-400' },
]

const tickets = [
    { id: '#TKT-1025', issue: 'VPN not connecting', category: 'Network', priority: 'High', status: 'Open', created: 'Today' },
    { id: '#TKT-1024', issue: 'Phishing email reported', category: 'Security', priority: 'High', status: 'In Progress', created: 'Today' },
    { id: '#TKT-1023', issue: 'VPN not connecting', category: 'Network', priority: 'High', status: 'Resolved', created: 'Today' },
    { id: '#TKT-1022', issue: 'Database connectivity issue', category: 'Database', priority: 'High', status: 'Resolved', created: 'Yesterday' },
]

const statusColor = {
    Open: 'bg-purple-100 text-purple-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Resolved: 'bg-green-100 text-green-700',
}

function Dashboard() {
    return (
        <div>
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Hi, [Employee Name] how can we help you today?</h1>
                <div className="flex items-center gap-4">
                    <Bell className="text-gray-500" size={20} />
                    <UserCircle className="text-gray-500" size={28} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left/main column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stat cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {stats.map(({ label, value, color, icon: Icon, iconColor }) => (
                            <div key={label} className={`bg-white rounded-xl border-l-4 ${color} shadow-sm p-4`}>
                                <Icon className={iconColor} size={20} />
                                <p className="text-2xl font-bold text-gray-900 mt-2">{String(value).padStart(2, '0')}</p>
                                <p className="text-xs text-gray-500">{label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Ask AI box */}
                    <div className="bg-white rounded-xl border border-purple-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-1">
                            <Headphones className="text-purple-500" size={22} />
                            <h2 className="font-bold text-gray-900">How can we help you today?</h2>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                            Describe your problem and assistify will help you before you raise a service request
                        </p>
                        <input
                            type="text"
                            placeholder="Describe your problem (e.g.. CR, incident, etc)..."
                            className="w-full border border-gray-300 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                        <div className="flex justify-center mt-4">
                            <button className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-purple-700">
                                <Send size={16} /> Ask Tara
                            </button>
                        </div>
                    </div>

                    {/* Tickets table */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-500">Recent Tickets</span>
                            <button className="text-sm font-medium text-purple-600 hover:underline">View all tickets</button>
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="text-left text-gray-500 border-b border-gray-100">
                                <th className="py-2">Ticket ID</th>
                                <th>Issue</th>
                                <th>Category</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tickets.map((t, i) => (
                                <tr key={i} className="border-b border-gray-50 last:border-0">
                                    <td className="py-3">{t.id}</td>
                                    <td>{t.issue}</td>
                                    <td>{t.category}</td>
                                    <td>{t.priority}</td>
                                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[t.status]}`}>
                        {t.status}
                      </span>
                                    </td>
                                    <td>{t.created}</td>
                                    <td>
                                        <button className="text-purple-600 font-medium">View</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                            <p className="font-semibold text-gray-900 text-sm mb-1">Having an IT problem?</p>
                            <p className="text-xs text-gray-500 mb-3">Raise a support ticket and our IT team will help you.</p>
                            <button className="bg-purple-600 text-white text-xs font-medium px-3 py-2 rounded-full w-full">
                                + Raise Request
                            </button>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                            <p className="font-semibold text-gray-900 text-sm mb-1">Need Quick Help?</p>
                            <p className="text-xs text-gray-500 mb-3">Find troubleshooting steps or ask Assistify for help.</p>
                            <button className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-2 rounded-full w-full">
                                Ask Tara
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                        <h3 className="font-bold text-gray-900 mb-1">Knowledge Base</h3>
                        <p className="text-xs text-gray-500 mb-3">Browse common IT solutions and troubleshooting guides.</p>
                        <ul className="text-sm text-gray-700 space-y-1 mb-4 list-disc list-inside">
                            <li>How to reset your password</li>
                            <li>VPN connection troubleshooting</li>
                            <li>Setting up your office printer</li>
                        </ul>
                        <button className="bg-purple-100 text-purple-700 text-sm font-medium px-4 py-2 rounded-full w-full">
                            Browse Articles
                        </button>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col items-center text-center">
                        <Headphones className="text-purple-500 mb-2" size={28} />
                        <h3 className="font-bold text-gray-900">Help / Support</h3>
                        <p className="text-xs text-gray-500 mb-3">Need more assistance? Contact the Service Desk.</p>
                        <button className="bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-full w-full">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard