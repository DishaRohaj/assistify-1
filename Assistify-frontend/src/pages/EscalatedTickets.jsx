import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../api/client'

function EscalatedTickets() {
    const navigate = useNavigate()
    const [tickets, setTickets] = useState([])

    useEffect(() => {
        apiRequest('/requests/my-assigned').then((all) => {
            setTickets(all.filter(t => t.status === 'IN_PROGRESS'))
        }).catch(console.error)
    }, [])

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Escalated Tickets</h1>
            <p className="text-gray-500 text-sm mb-6">Tickets escalated to you for deeper investigation.</p>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100">
                        <th className="py-2">Ticket ID</th>
                        <th>Request</th>
                        <th>Priority</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tickets.map((t) => (
                        <tr key={t.id} className="border-b border-gray-50 last:border-0">
                            <td className="py-3">#{t.id}</td>
                            <td>{t.description}</td>
                            <td>{t.priority || '-'}</td>
                            <td>
                                <button onClick={() => navigate(`/agent/tickets/${t.id}`)} className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded">Open</button>
                            </td>
                        </tr>
                    ))}
                    {tickets.length === 0 && (
                        <tr><td colSpan={4} className="py-6 text-center text-gray-400">Nothing escalated to you right now.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default EscalatedTickets