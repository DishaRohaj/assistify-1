import { useEffect, useState } from 'react'
import { apiRequest } from '../api/client'

function Assignment() {
    const [requests, setRequests] = useState([])
    const [agents, setAgents] = useState([])
    const [savingId, setSavingId] = useState(null)

    const load = () => {
        apiRequest('/requests/all').then(setRequests).catch(console.error)
        apiRequest('/requests/agents').then(setAgents).catch(console.error)
    }

    useEffect(() => { load() }, [])

    const unassigned = requests.filter(r => r.category && !r.assignedToName)
    const assignedToL1 = requests.filter(r => r.assignedToRole === 'L1_SUPPORT')
    const assignedToL2 = requests.filter(r => r.assignedToRole === 'L2_SUPPORT')

    const workload = agents.map(a => ({
        ...a,
        openCount: requests.filter(r => r.assignedToId === a.id && !['CLOSED', 'RESOLVED'].includes(r.status)).length,
    }))

    const handleAssign = async (requestId, agentId) => {
        if (!agentId) return
        setSavingId(requestId)
        try {
            await apiRequest(`/requests/${requestId}/assign`, {
                method: 'PUT',
                body: { assignedToUserId: agentId },
            })
            load()
        } catch (err) {
            console.error(err)
        } finally {
            setSavingId(null)
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Assignment</h1>
            <p className="text-gray-500 text-sm mb-6">Assign service requests to the appropriate support team and agents.</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <p className="text-2xl font-bold text-gray-900">{String(unassigned.length).padStart(2, '0')}</p>
                    <p className="text-xs text-gray-500">Unassigned (classified, awaiting agent)</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <p className="text-2xl font-bold text-gray-900">{String(assignedToL1.length).padStart(2, '0')}</p>
                    <p className="text-xs text-gray-500">Assigned to L1</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <p className="text-2xl font-bold text-gray-900">{String(assignedToL2.length).padStart(2, '0')}</p>
                    <p className="text-xs text-gray-500">Assigned to L2</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
                <h2 className="font-bold text-gray-900 mb-3">Assignment Queue</h2>
                <p className="text-sm text-gray-500 mb-3">Classified requests waiting to be assigned an agent</p>
                <table className="w-full text-sm">
                    <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100">
                        <th className="py-2">Ticket ID</th>
                        <th>Request</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Assign To</th>
                    </tr>
                    </thead>
                    <tbody>
                    {unassigned.map((r) => (
                        <tr key={r.id} className="border-b border-gray-50 last:border-0">
                            <td className="py-3">#{r.id}</td>
                            <td>{r.description}</td>
                            <td>{r.category}</td>
                            <td>{r.priority || '—'}</td>
                            <td>
                                <select
                                    disabled={savingId === r.id}
                                    defaultValue=""
                                    onChange={(e) => handleAssign(r.id, e.target.value)}
                                    className="border border-gray-300 rounded-lg px-2 py-1 text-sm outline-none"
                                >
                                    <option value="" disabled>Select agent</option>
                                    {agents.map((a) => (
                                        <option key={a.id} value={a.id}>{a.fullName} ({a.role})</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                    {unassigned.length === 0 && (
                        <tr><td colSpan={5} className="py-6 text-center text-gray-400">Nothing waiting on assignment right now.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h2 className="font-bold text-gray-900 mb-3">Team Workload</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {workload.map((a) => (
                        <div key={a.id} className="border border-gray-100 rounded-lg p-3">
                            <p className="font-medium text-gray-900 text-sm">{a.fullName}</p>
                            <p className="text-xs text-gray-500">{a.role.replace('_', ' ')} · {a.openCount} open</p>
                        </div>
                    ))}
                    {workload.length === 0 && <p className="text-gray-400 text-sm">No agents found.</p>}
                </div>
            </div>
        </div>
    )
}

export default Assignment