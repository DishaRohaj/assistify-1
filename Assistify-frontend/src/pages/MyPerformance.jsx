import { useEffect, useState } from 'react'
import { apiRequest } from '../api/client'

function MyPerformance() {
    const [tickets, setTickets] = useState([])

    useEffect(() => {
        apiRequest('/requests/my-assigned').then(setTickets).catch(console.error)
    }, [])

    const resolved = tickets.filter(t => ['RESOLVED', 'CLOSED', 'PENDING_USER_CONFIRMATION'].includes(t.status)).length
    const open = tickets.length - resolved
    const escalated = tickets.filter(t => t.status === 'IN_PROGRESS').length

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">My Performance</h1>
            <p className="text-gray-500 text-sm mb-6">Track your support workload and resolution activity.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
                    <p className="text-xs text-gray-500">Total Assigned</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <p className="text-2xl font-bold text-green-600">{resolved}</p>
                    <p className="text-xs text-gray-500">Resolved</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <p className="text-2xl font-bold text-gray-900">{open}</p>
                    <p className="text-xs text-gray-500">Open</p>
                </div>
            </div>
        </div>
    )
}

export default MyPerformance