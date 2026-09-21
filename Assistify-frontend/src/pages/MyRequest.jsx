import { Search, SlidersHorizontal } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { apiRequest } from '../api/client'

const tabs = [
    'All',
    'Open',
    'Assigned',
    'In Progress',
    'Resolved',
    'Pending User Confirmation',
    'Closed'
]

const statusColor = {
    OPEN: 'bg-purple-100 text-purple-700',
    ASSIGNED: 'bg-amber-100 text-amber-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    RESOLVED: 'bg-green-100 text-green-700',
    PENDING_USER_CONFIRMATION: 'bg-orange-100 text-orange-700',
    CLOSED: 'bg-gray-200 text-gray-600',
    REOPENED: 'bg-red-100 text-red-700',
}

function MyRequest() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const [activeTab, setActiveTab] = useState(
        searchParams.get('status') || 'All'
    )
    const [tickets, setTickets] = useState([])


    useEffect(() => {
        apiRequest('/requests')
            .then(setTickets)
            .catch(console.error)
    }, [])

    useEffect(() => {
        setActiveTab(searchParams.get('status') || 'All')
    }, [searchParams])

    // Filter tickets according to selected tab
    const filteredTickets =
        activeTab === 'All'
            ? tickets
            : tickets.filter(
                (t) =>
                    t.status.replace(/_/g, ' ').toLowerCase() ===
                    activeTab.toLowerCase()
            )

    return (
        <div>

            {/* Page Heading */}
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
                My Request
            </h1>

            <p className="text-gray-500 font-medium mb-6">
                Track and manage all your IT support requests.
            </p>

            {/* Search + Filters */}
            <div className="flex gap-3 mb-6">

                <div className="flex-1 flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">

                    <Search size={16} className="text-gray-400" />

                    <input
                        type="text"
                        placeholder="Search requests...."
                        className="flex-1 text-sm outline-none"
                    />

                </div>

                <button
                    className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 bg-white"
                >
                    <SlidersHorizontal size={16} />
                    Filters
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

            {/* Info Banner */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">

                <p className="font-semibold text-gray-900 text-sm">
                    Can't find what you're looking for?
                </p>

                <p className="text-sm text-gray-600">
                    Raise a new service request and our Service Desk will help you.
                </p>

            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-purple-200 shadow-sm p-4">

                <div className="flex justify-between items-center mb-3">

                    <span className="text-purple-600 font-semibold text-sm">
                        View all request
                    </span>

                </div>

                <table className="w-full text-sm">

                    {/* Table Header */}
                    <thead>

                    <tr className="text-left text-gray-500 border-b border-gray-100">

                        <th className="py-2">Ticket ID</th>
                        <th>Issue</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Created on</th>
                        <th>Updated on</th>
                        <th>Action</th>

                    </tr>

                    </thead>

                    {/* Table Body */}
                    <tbody>

                    {filteredTickets.map((r, i) => (

                        <tr
                            key={r.id || i}
                            className="border-b border-gray-50 last:border-0"
                        >

                            <td className="py-3">
                                {r.id}
                            </td>

                            <td>{r.description}</td>

                            <td>
                                {r.priority}
                            </td>

                            <td>

                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            statusColor[r.status] ||
                                            'bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        {r.status}
                                    </span>

                            </td>

                            <td>{new Date(r.createdAt).toLocaleDateString()}</td>

                            <td>{r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : '—'}</td>

                            <td>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/my-request/${String(r.id).replace('#', '')}`
                                        )
                                    }
                                    className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded"
                                >
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