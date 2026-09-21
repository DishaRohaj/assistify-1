import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../api/client'
import { Search } from 'lucide-react'

const statusColor = {
    OPEN: 'bg-purple-100 text-purple-700',
    ASSIGNED: 'bg-amber-100 text-amber-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    RESOLVED: 'bg-green-100 text-green-700',
    PENDING_USER_CONFIRMATION: 'bg-orange-100 text-orange-700',
    CLOSED: 'bg-gray-200 text-gray-600',
    REOPENED: 'bg-red-100 text-red-700',
}

function ServiceRequests() {
    const navigate = useNavigate()
    const [requests, setRequests] = useState([])
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')

    useEffect(() => {
        apiRequest('/requests/all').then(setRequests).catch(console.error)
    }, [])

    const filtered = requests.filter((r) => {
        const matchesSearch = search === '' ||
            r.description.toLowerCase().includes(search.toLowerCase()) ||
            String(r.id).includes(search) ||
            r.raisedByName?.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = statusFilter === '' || r.status === statusFilter
        return matchesSearch && matchesStatus
    })

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Service Requests</h1>
                    <p className="text-gray-500 text-sm">Review, classify and route incoming service requests</p>
                </div>
            </div>

            <div className="flex gap-3 mb-4">
                <div className="flex-1 flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
                    <Search size={16} className="text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by ticket ID, requester or issue..."
                        className="flex-1 text-sm outline-none"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                >
                    <option value="">All statuses</option>
                    {Object.keys(statusColor).map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                </select>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <p className="text-sm text-gray-500 mb-3">{filtered.length} Requests</p>
                <table className="w-full text-sm">
                    <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100">
                        <th className="py-2">Ticket ID</th>
                        <th>Request</th>
                        <th>Requester</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Assigned To</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map((r) => (
                        <tr key={r.id} className="border-b border-gray-50 last:border-0">
                            <td className="py-3">#{r.id}</td>
                            <td>{r.description}</td>
                            <td>{r.raisedByName || '-'}</td>
                            <td>{r.category || 'Unclassified'}</td>
                            <td>{r.priority || '-'}</td>
                            <td>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[r.status] || 'bg-gray-100 text-gray-600'}`}>
                                        {r.status.replace(/_/g, ' ')}
                                    </span>
                            </td>
                            <td>{r.assignedToName || 'Unassigned'}</td>
                            <td>
                                <button
                                    onClick={() => navigate(`/service-desk/requests/${r.id}`)}
                                    className="bg-purple-600 text-white text-xs font-medium px-3 py-1 rounded"
                                >
                                    {r.status === 'OPEN' ? 'Review' : 'View'}
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

export default ServiceRequests