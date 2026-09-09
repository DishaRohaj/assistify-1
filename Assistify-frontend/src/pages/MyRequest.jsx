/*function MyRequest() {
    return <h1 className="text-2xl font-bold text-gray-900">My Request</h1>
}
export default MyRequest*/
import { useState } from 'react'
import { Search, SlidersHorizontal, Plus } from 'lucide-react'

const tabs = ['All', 'Open', 'In Progress', 'Resolved', 'Pending Feedback', 'Closed']

const requests = [
    { id: '#TKT-1024', issue: 'VPN not connecting', priority: 'High', status: 'Open', site: 'Site A', created: 'Today', updated: '1 Sept' },
    { id: '#TKT-1023', issue: 'Phishing email reported', priority: 'High', status: 'In Progress', site: 'Site A', created: 'Today', updated: '11 Sept' },
    { id: '#TKT-1024', issue: 'VPN not connecting', priority: 'Medium', status: 'Resolved', site: 'Site A', created: 'Yesterday', updated: '11 Sept' },
    { id: '#TKT-1024', issue: 'Database connectivity issue', priority: 'High', status: 'Resolved', site: 'Site A', created: 'Today', updated: '1 Sept' },
]

const statusColor = {
    Open: 'bg-purple-100 text-purple-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Resolved: 'bg-green-100 text-green-700',
}

function MyRequest() {
    const [activeTab, setActiveTab] = useState('All')

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">My Request</h1>
            <p className="text-gray-500 font-medium mb-6">Track and manage all your IT support requests.</p>

            {/* Search + filters */}
            <div className="flex gap-3 mb-6">
                <div className="flex-1 flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
                    <Search size={16} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search requests...."
                        className="flex-1 text-sm outline-none"
                    />
                </div>
                <button className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 bg-white">
                    <SlidersHorizontal size={16} /> Filters
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-2 text-sm font-medium ${
                            activeTab === tab
                                ? 'text-purple-600 border-b-2 border-purple-600'
                                : 'text-gray-500'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Info banner */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                <p className="font-semibold text-gray-900 text-sm">Can't find what you're looking for?</p>
                <p className="text-sm text-gray-600">Raise a new service request and our Service Desk will help you.</p>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-purple-200 shadow-sm p-4">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-purple-600 font-semibold text-sm">View all request</span>
                </div>
                <table className="w-full text-sm">
                    <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100">
                        <th className="py-2">Ticket ID</th>
                        <th>Issue</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Site</th>
                        <th>Created on</th>
                        <th>Updated on</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {requests.map((r, i) => (
                        <tr key={i} className="border-b border-gray-50 last:border-0">
                            <td className="py-3">{r.id}</td>
                            <td>{r.issue}</td>
                            <td>{r.priority}</td>
                            <td>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[r.status]}`}>
                    {r.status}
                  </span>
                            </td>
                            <td>{r.site}</td>
                            <td>{r.created}</td>
                            <td>{r.updated}</td>
                            <td>
                                <button className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded">
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MyRequest