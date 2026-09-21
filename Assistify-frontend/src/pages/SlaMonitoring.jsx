import { useEffect, useState } from 'react'
import { apiRequest } from '../api/client'
import { AlertTriangle } from 'lucide-react'

function slaState(r) {
    if (!r.resolutionDueAt) return null
    if (['RESOLVED', 'CLOSED', 'PENDING_USER_CONFIRMATION'].includes(r.status)) return null
    const due = new Date(r.resolutionDueAt)
    const now = new Date()
    const hoursLeft = (due - now) / (1000 * 60 * 60)
    if (hoursLeft < 0) return 'BREACHED'
    if (hoursLeft < 1) return 'AT_RISK'
    return 'WITHIN_SLA'
}

function timeRemaining(r) {
    if (!r.resolutionDueAt) return '-'
    const diffMs = new Date(r.resolutionDueAt) - new Date()
    const abs = Math.abs(diffMs)
    const h = Math.floor(abs / 3600000)
    const m = Math.floor((abs % 3600000) / 60000)
    const label = `${h}h ${m}m`
    return diffMs < 0 ? `${label} overdue` : label
}

const stateStyle = {
    WITHIN_SLA: 'bg-gray-100 text-gray-600',
    AT_RISK: 'bg-amber-100 text-amber-700',
    BREACHED: 'bg-red-100 text-red-700',
}

function SlaMonitoring() {
    const [requests, setRequests] = useState([])

    useEffect(() => {
        apiRequest('/requests/all').then(setRequests).catch(console.error)
    }, [])

    const tracked = requests.filter(r => r.resolutionDueAt && !['RESOLVED', 'CLOSED', 'PENDING_USER_CONFIRMATION'].includes(r.status))
    const withinSla = tracked.filter(r => slaState(r) === 'WITHIN_SLA')
    const atRisk = tracked.filter(r => slaState(r) === 'AT_RISK')
    const breached = tracked.filter(r => slaState(r) === 'BREACHED')
    const compliance = tracked.length === 0 ? 100 : Math.round(((tracked.length - breached.length) / tracked.length) * 100)

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">SLA Monitoring</h1>
            <p className="text-gray-500 text-sm mb-6">Monitor service-level commitments and identify requests requiring attention.</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <p className="text-2xl font-bold text-gray-900">{compliance}%</p>
                    <p className="text-xs text-gray-500">SLA Compliance</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <p className="text-2xl font-bold text-amber-600">{String(atRisk.length).padStart(2, '0')}</p>
                    <p className="text-xs text-gray-500">At Risk</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <p className="text-2xl font-bold text-red-600">{String(breached.length).padStart(2, '0')}</p>
                    <p className="text-xs text-gray-500">Breached</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <p className="text-2xl font-bold text-gray-900">{String(withinSla.length).padStart(2, '0')}</p>
                    <p className="text-xs text-gray-500">Within SLA</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={16} className="text-amber-500" />
                    <h2 className="font-bold text-gray-900">Requests Requiring Attention</h2>
                </div>
                <table className="w-full text-sm">
                    <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100">
                        <th className="py-2">Ticket ID</th>
                        <th>Request</th>
                        <th>Priority</th>
                        <th>Assigned To</th>
                        <th>Time Remaining</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {[...atRisk, ...breached].map((r) => (
                        <tr key={r.id} className="border-b border-gray-50 last:border-0">
                            <td className="py-3">#{r.id}</td>
                            <td>{r.description}</td>
                            <td>{r.priority}</td>
                            <td>{r.assignedToName || 'Unassigned'}</td>
                            <td>{timeRemaining(r)}</td>
                            <td>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${stateStyle[slaState(r)]}`}>
                                        {slaState(r).replace('_', ' ')}
                                    </span>
                            </td>
                        </tr>
                    ))}
                    {atRisk.length === 0 && breached.length === 0 && (
                        <tr><td colSpan={6} className="py-6 text-center text-gray-400">Nothing at risk or breached right now.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default SlaMonitoring