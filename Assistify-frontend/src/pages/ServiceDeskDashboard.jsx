import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../api/client'
import { Mail, ClipboardList, UserX, AlertTriangle } from 'lucide-react'

function slaState(r) {
    if (!r.resolutionDueAt) return null
    if (['RESOLVED', 'CLOSED', 'PENDING_USER_CONFIRMATION'].includes(r.status)) return null
    const hoursLeft = (new Date(r.resolutionDueAt) - new Date()) / 3600000
    if (hoursLeft < 0) return 'BREACHED'
    if (hoursLeft < 1) return 'AT_RISK'
    return 'WITHIN_SLA'
}

function ServiceDeskDashboard() {
    const navigate = useNavigate()
    const [requests, setRequests] = useState([])
    const [activeFilter, setActiveFilter] = useState('new')

    useEffect(() => {
        apiRequest('/requests/all').then(setRequests).catch(console.error)
    }, [])

    const newRequests = requests.filter(r => r.status === 'OPEN')
    const pendingValidation = requests.filter(r => r.category == null)
    const unassigned = requests.filter(r => r.category != null && r.assignedToName == null)
    const slaAtRisk = requests.filter(r => slaState(r) === 'AT_RISK' || slaState(r) === 'BREACHED')

    const stats = [
        { key: 'new', label: 'New Requests', value: newRequests.length, icon: Mail, color: 'text-purple-500' },
        { key: 'pending', label: 'Pending Validation', value: pendingValidation.length, icon: ClipboardList, color: 'text-blue-500' },
        { key: 'unassigned', label: 'Unassigned', value: unassigned.length, icon: UserX, color: 'text-gray-500' },
        { key: 'sla', label: 'SLA At Risk', value: slaAtRisk.length, icon: AlertTriangle, color: 'text-red-500' },
    ]

    const filteredRows =
        activeFilter === 'new' ? newRequests :
            activeFilter === 'pending' ? pendingValidation :
                activeFilter === 'unassigned' ? unassigned :
                    slaAtRisk

    const tableTitle =
        activeFilter === 'new' ? 'Incoming Service Requests (New)' :
            activeFilter === 'pending' ? 'Requests Pending Validation' :
                activeFilter === 'unassigned' ? 'Classified Requests Awaiting Agent' :
                    'SLA At Risk Requests'

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Service Desk Dashboard</h1>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {stats.map(({ key, label, value, icon: Icon, color }) => (
                    <button
                        key={key}
                        onClick={() => setActiveFilter(key)}
                        className={`text-left bg-white rounded-xl border shadow-sm p-4 transition ${
                            activeFilter === key
                                ? 'border-purple-400 ring-2 ring-purple-100'
                                : 'border-gray-200 hover:border-purple-200'
                        }`}
                    >
                        <Icon className={color} size={20} />
                        <p className="text-2xl font-bold text-gray-900 mt-2">{String(value).padStart(2, '0')}</p>
                        <p className="text-xs text-gray-500">{label}</p>
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h2 className="font-bold text-gray-900 mb-3">{tableTitle}</h2>

                <table className="w-full text-sm">
                    <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100">
                        <th className="py-2">Ticket ID</th>
                        <th>Request</th>
                        <th>Requester</th>
                        <th>{activeFilter === 'sla' ? 'Priority' : 'Category'}</th>
                        <th>{activeFilter === 'sla' ? 'Time Remaining' : 'Received'}</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredRows.map((r) => (
                        <tr key={r.id} className="border-b border-gray-50 last:border-0">
                            <td className="py-3">#{r.id}</td>
                            <td>{r.description}</td>
                            <td>
                                {r.raisedByName || '-'}{' '}
                                <span className="text-gray-400 text-xs">({r.raisedByLocation || '-'})</span>
                            </td>
                            {activeFilter === 'sla' ? (
                                <>
                                    <td>{r.priority || '-'}</td>
                                    <td>
                                        {r.resolutionDueAt
                                            ? new Date(r.resolutionDueAt) < new Date()
                                                ? 'Overdue'
                                                : `${Math.max(0, Math.floor((new Date(r.resolutionDueAt) - new Date()) / 60000))} min left`
                                            : '-'}
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{r.category || 'Unclassified'}</td>
                                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                                </>
                            )}
                            <td>
                                <button
                                    onClick={() => navigate(`/service-desk/requests/${r.id}`)}
                                    className="bg-purple-600 text-white text-xs font-medium px-3 py-1 rounded"
                                >
                                    Review
                                </button>
                            </td>
                        </tr>
                    ))}
                    {filteredRows.length === 0 && (
                        <tr><td colSpan={6} className="py-6 text-center text-gray-400">Nothing here right now.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ServiceDeskDashboard