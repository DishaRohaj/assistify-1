import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../api/client'
import { FileText, Clock, TrendingUp, AlertTriangle } from 'lucide-react'

function slaState(r) {
    if (!r.resolutionDueAt) return null
    if (['RESOLVED', 'CLOSED', 'PENDING_USER_CONFIRMATION'].includes(r.status)) return null
    const hoursLeft = (new Date(r.resolutionDueAt) - new Date()) / 3600000
    if (hoursLeft < 0) return 'BREACHED'
    if (hoursLeft < 1) return 'AT_RISK'
    return 'WITHIN_SLA'
}

function ManagerDashboard() {
    const navigate = useNavigate()
    const [requests, setRequests] = useState([])
    const [agents, setAgents] = useState([])

    useEffect(() => {
        apiRequest('/requests/all').then(setRequests).catch(console.error)
        apiRequest('/requests/agents').then(setAgents).catch(console.error)
    }, [])

    const total = requests.length
    const open = requests.filter(r => !['RESOLVED', 'CLOSED'].includes(r.status)).length
    const tracked = requests.filter(r => r.resolutionDueAt && !['RESOLVED', 'CLOSED', 'PENDING_USER_CONFIRMATION'].includes(r.status))
    const breached = tracked.filter(r => slaState(r) === 'BREACHED')
    const compliance = tracked.length === 0 ? 100 : Math.round(((tracked.length - breached.length) / tracked.length) * 100)
    const escalated = requests.filter(r => r.status === 'IN_PROGRESS' && r.assignedToRole === 'L2_SUPPORT').length

    const attention = requests.filter(r => slaState(r) === 'BREACHED' || slaState(r) === 'AT_RISK')

    const workload = agents.map(a => ({
        ...a,
        open: requests.filter(r => r.assignedToId === a.id && !['CLOSED', 'RESOLVED'].includes(r.status)).length,
    }))

    const stats = [
        { label: 'Total Requests', value: total, icon: FileText, color: 'text-purple-500', onClick: () => navigate('/manager/requests') },
        { label: 'Open Requests', value: open, icon: Clock, color: 'text-blue-500', onClick: () => navigate('/manager/requests') },
        { label: 'SLA Compliance', value: `${compliance}%`, icon: TrendingUp, color: 'text-green-500', onClick: () => navigate('/manager/sla') },
        { label: 'Escalated to L2', value: escalated, icon: AlertTriangle, color: 'text-amber-500', onClick: () => navigate('/manager/requests') },
    ]

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Manager Dashboard</h1>
            <p className="text-gray-500 text-sm mb-6">Monitor service operations, team performance and SLA commitments.</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {stats.map(({ label, value, icon: Icon, color, onClick }) => (
                    <button
                        key={label}
                        onClick={onClick}
                        className="text-left bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:border-purple-300 hover:shadow-md hover:-translate-y-0.5 transition"
                    >
                        <Icon className={color} size={20} />
                        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
                        <p className="text-xs text-gray-500">{label}</p>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="font-bold text-gray-900">Team Workload</h2>
                        <button onClick={() => navigate('/manager/workload')} className="text-xs text-purple-600 font-medium">View all</button>
                    </div>
                    <div className="space-y-2">
                        {workload.map((a) => (
                            <div key={a.id} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                                <span className="text-gray-700">{a.fullName} <span className="text-gray-400 text-xs">({a.role.replace('_', ' ')})</span></span>
                                <span className="font-medium text-gray-900">{a.open} open</span>
                            </div>
                        ))}
                        {workload.length === 0 && <p className="text-gray-400 text-sm">No agents found.</p>}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <h2 className="font-bold text-gray-900 mb-3">Requires Management Attention</h2>
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="text-left text-gray-500 border-b border-gray-100">
                            <th className="py-2">Ticket</th>
                            <th>Reason</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {attention.map((r) => (
                            <tr key={r.id} className="border-b border-gray-50 last:border-0">
                                <td className="py-2">#{r.id}</td>
                                <td className={slaState(r) === 'BREACHED' ? 'text-red-600' : 'text-amber-600'}>
                                    SLA {slaState(r) === 'BREACHED' ? 'Breached' : 'At Risk'}
                                </td>
                                <td>
                                    <button onClick={() => navigate('/manager/requests')} className="text-purple-600 text-xs font-medium">Review</button>
                                </td>
                            </tr>
                        ))}
                        {attention.length === 0 && (
                            <tr><td colSpan={3} className="py-4 text-center text-gray-400">Nothing needs attention right now.</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ManagerDashboard