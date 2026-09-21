import { useEffect, useState } from 'react'
import { apiRequest } from '../api/client'

function TeamWorkload() {
    const [requests, setRequests] = useState([])
    const [agents, setAgents] = useState([])

    useEffect(() => {
        apiRequest('/requests/all').then(setRequests).catch(console.error)
        apiRequest('/requests/agents').then(setAgents).catch(console.error)
    }, [])

    const workload = agents.map(a => ({
        ...a,
        open: requests.filter(r => r.assignedToId === a.id && !['CLOSED', 'RESOLVED'].includes(r.status)).length,
        resolved: requests.filter(r => r.assignedToId === a.id && ['CLOSED', 'RESOLVED'].includes(r.status)).length,
    }))

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Team Workload</h1>
            <p className="text-gray-500 text-sm mb-6">Current workload across all support agents.</p>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100">
                        <th className="py-2">Agent</th>
                        <th>Role</th>
                        <th>Open</th>
                        <th>Resolved</th>
                    </tr>
                    </thead>
                    <tbody>
                    {workload.map((a) => (
                        <tr key={a.id} className="border-b border-gray-50 last:border-0">
                            <td className="py-3">{a.fullName}</td>
                            <td>{a.role.replace('_', ' ')}</td>
                            <td>{a.open}</td>
                            <td>{a.resolved}</td>
                        </tr>
                    ))}
                    {workload.length === 0 && <tr><td colSpan={4} className="py-6 text-center text-gray-400">No agents found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TeamWorkload
