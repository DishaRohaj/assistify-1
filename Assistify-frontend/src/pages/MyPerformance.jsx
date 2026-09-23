import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../api/client'

function MyPerformance() {
    const navigate = useNavigate()
    const [tickets, setTickets] = useState([])
    const [activeFilter, setActiveFilter] = useState('total')

    useEffect(() => {
        apiRequest('/requests/my-assigned').then(setTickets).catch(console.error)
    }, [])

    const resolvedTickets = tickets.filter(t => ['RESOLVED', 'CLOSED', 'PENDING_USER_CONFIRMATION'].includes(t.status))
    const openTickets = tickets.filter(t => !['RESOLVED', 'CLOSED', 'PENDING_USER_CONFIRMATION'].includes(t.status))

    const filteredRows =
        activeFilter === 'resolved' ? resolvedTickets :
            activeFilter === 'open' ? openTickets :
                tickets

    const tableTitle =
        activeFilter === 'resolved' ? 'Resolved Tickets' :
            activeFilter === 'open' ? 'Open Tickets' :
                'All Assigned Tickets'

    const stats = [
        { key: 'total', label: 'Total Assigned', value: tickets.length, valueClass: 'text-gray-900' },
        { key: 'resolved', label: 'Resolved', value: resolvedTickets.length, valueClass: 'text-green-600' },
        { key: 'open', label: 'Open', value: openTickets.length, valueClass: 'text-gray-900' },
    ]

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">My Performance</h1>
            <p className="text-gray-500 text-sm mb-6">Track your support workload and resolution activity.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                {stats.map(({ key, label, value, valueClass }) => (
                    <button
                        key={key}
                        onClick={() => setActiveFilter(key)}
                        className={`text-left bg-white rounded-xl border shadow-sm p-4 transition ${
                            activeFilter === key
                                ? 'border-purple-400 ring-2 ring-purple-100'
                                : 'border-gray-200 hover:border-purple-200'
                        }`}
                    >
                        <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
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
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredRows.map((t) => (
                        <tr key={t.id} className="border-b border-gray-50 last:border-0">
                            <td className="py-3">#{t.id}</td>
                            <td>{t.description}</td>
                            <td>{t.priority || '-'}</td>
                            <td>{t.status.replace(/_/g, ' ')}</td>
                            <td>
                                <button onClick={() => navigate(`/agent/tickets/${t.id}`)} className="text-purple-600 font-medium text-xs">Open</button>
                            </td>
                        </tr>
                    ))}
                    {filteredRows.length === 0 && (
                        <tr><td colSpan={5} className="py-6 text-center text-gray-400">Nothing here right now.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MyPerformance