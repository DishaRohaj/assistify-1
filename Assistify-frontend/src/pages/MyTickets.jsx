import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../api/client'

const statusColor = {
    ASSIGNED: 'bg-amber-100 text-amber-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    RESOLVED: 'bg-green-100 text-green-700',
    PENDING_USER_CONFIRMATION: 'bg-orange-100 text-orange-700',
    CLOSED: 'bg-gray-200 text-gray-600',
    REOPENED: 'bg-red-100 text-red-700',
}

function MyTickets() {
    const navigate = useNavigate()
    const [tickets, setTickets] = useState([])

    useEffect(() => {
        apiRequest('/requests/my-assigned').then(setTickets).catch(console.error)
    }, [])

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">My Tickets</h1>
            <p className="text-gray-500 text-sm mb-6">View and manage service requests assigned to you.</p>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100">
                        <th className="py-2">Ticket ID</th>
                        <th>Request</th>
                        <th>Requester</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tickets.map((t) => (
                        <tr key={t.id} className="border-b border-gray-50 last:border-0">
                            <td className="py-3">#{t.id}</td>
                            <td>{t.description}</td>
                            <td>{t.raisedByName || '-'}</td>
                            <td>{t.priority || '-'}</td>
                            <td>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[t.status] || 'bg-gray-100 text-gray-600'}`}>
                                        {t.status.replace(/_/g, ' ')}
                                    </span>
                            </td>
                            <td>
                                <button onClick={() => navigate(`/agent/tickets/${t.id}`)} className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded">Open</button>
                            </td>
                        </tr>
                    ))}
                    {tickets.length === 0 && (
                        <tr><td colSpan={6} className="py-6 text-center text-gray-400">No tickets assigned yet.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MyTickets