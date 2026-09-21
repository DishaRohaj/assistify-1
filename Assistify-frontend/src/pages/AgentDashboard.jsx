import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../api/client'
import { Ticket, Bell, ArrowUpCircle, AlertTriangle } from 'lucide-react'

function AgentDashboard() {
    const navigate = useNavigate()
    const [tickets, setTickets] = useState([])
    const [escalatedByMe, setEscalatedByMe] = useState([])
    const [role, setRole] = useState('')
    const [activeFilter, setActiveFilter] = useState('open')

    useEffect(() => {
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user')
        if (storedUser) {
            setRole(JSON.parse(storedUser).role)
        }
        apiRequest('/requests/my-assigned').then(setTickets).catch(console.error)
    }, [])

    useEffect(() => {
        if (role === 'L1_SUPPORT') {
            apiRequest('/requests/escalated-by-me').then(setEscalatedByMe).catch(console.error)
        }
    }, [role])

    const open = tickets.filter(t => !['RESOLVED', 'CLOSED', 'PENDING_USER_CONFIRMATION'].includes(t.status))
    const newOnes = tickets.filter(t => t.status === 'ASSIGNED')
    const atRisk = tickets.filter(t => {
        if (!t.resolutionDueAt) return false
        const hoursLeft = (new Date(t.resolutionDueAt) - new Date()) / 3600000
        return hoursLeft > 0 && hoursLeft < 1
    })
    const escalatedRows = role === 'L1_SUPPORT'
        ? escalatedByMe
        : tickets.filter(t => t.status === 'IN_PROGRESS' && t.assignedToRole === 'L2_SUPPORT')

    const stats = [
        { key: 'open', label: 'My Open Tickets', value: open.length, icon: Ticket, color: 'text-purple-500' },
        { key: 'new', label: 'New Assignments', value: newOnes.length, icon: Bell, color: 'text-blue-500' },
        { key: 'risk', label: 'SLA At Risk', value: atRisk.length, icon: AlertTriangle, color: 'text-red-500' },
        {
            key: 'escalated',
            label: role === 'L1_SUPPORT' ? 'Escalated by Me' : 'Escalated to Me',
            value: escalatedRows.length,
            icon: ArrowUpCircle,
            color: 'text-amber-500'
        },
    ]

    const filteredRows =
        activeFilter === 'open' ? open :
            activeFilter === 'new' ? newOnes :
                activeFilter === 'risk' ? atRisk :
                    escalatedRows

    const tableTitle =
        activeFilter === 'open' ? 'My Open Tickets' :
            activeFilter === 'new' ? 'New Assignments' :
                activeFilter === 'risk' ? 'SLA At Risk' :
                    role === 'L1_SUPPORT' ? 'Tickets I Escalated' : 'Escalated to Me'

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">IT Agent Dashboard</h1>
            <p className="text-gray-500 text-sm mb-6">Manage assigned service requests, resolve technical issues and monitor SLA commitments.</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
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

export default AgentDashboard