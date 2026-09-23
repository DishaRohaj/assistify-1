import { useEffect, useRef, useState } from 'react'
import { apiRequest } from '../api/client'
import { Download } from 'lucide-react'

function Reports() {
    const [requests, setRequests] = useState([])
    const [activeFilter, setActiveFilter] = useState(null)
    const agentTableRef = useRef(null)

    useEffect(() => {
        apiRequest('/requests/all').then(setRequests).catch(console.error)
    }, [])

    const total = requests.length
    const resolvedList = requests.filter(r => ['RESOLVED', 'CLOSED'].includes(r.status))
    const resolved = resolvedList.length
    const resolvedPct = total === 0 ? 0 : Math.round((resolved / total) * 100)

    const byCategory = requests.reduce((acc, r) => {
        const key = r.category || 'Unclassified'
        acc[key] = (acc[key] || 0) + 1
        return acc
    }, {})
    const maxCategoryCount = Math.max(1, ...Object.values(byCategory))

    const byAgent = requests.reduce((acc, r) => {
        if (!r.assignedToName) return acc
        const key = r.assignedToName

        if (!acc[key]) acc[key] = { open: 0, resolved: 0 }
        if (['RESOLVED', 'CLOSED'].includes(r.status)) acc[key].resolved++
        else acc[key].open++
        return acc
    }, {})

    const exportReport = () => {
        if (requests.length === 0) return

        const headers = ['ID', 'Description', 'Category', 'Priority', 'Status', 'Created On', 'Assigned To']
        const rows = requests.map(r => [
            r.id,
            `"${(r.description || '').replace(/"/g, '""')}"`,
            r.category || '',
            r.priority || '',
            r.status,
            new Date(r.createdAt).toLocaleDateString(),
            r.assignedToName || '',
        ])

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.download = `assistify-report-${new Date().toISOString().slice(0, 10)}.csv`
        link.click()

        URL.revokeObjectURL(url)
    }

    const handleStatClick = (key) => {
        if (key === 'agents') {
            agentTableRef.current?.scrollIntoView({ behavior: 'smooth' })
            return
        }
        setActiveFilter(activeFilter === key ? null : key)
    }

    const filteredRows = activeFilter === 'total' ? requests : activeFilter === 'resolved' ? resolvedList : []

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                    <p className="text-gray-500 text-sm">Analyze service request trends and support performance</p>
                </div>

                <button
                    onClick={exportReport}
                    disabled={requests.length === 0}
                    className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 bg-white disabled:opacity-50"
                >
                    <Download size={16} /> Export Report
                </button>

            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <button
                    onClick={() => handleStatClick('total')}
                    className={`text-left bg-white rounded-xl border shadow-sm p-4 transition ${
                        activeFilter === 'total' ? 'border-purple-400 ring-2 ring-purple-100' : 'border-gray-200 hover:border-purple-200'
                    }`}
                >
                    <p className="text-2xl font-bold text-gray-900">{total}</p>
                    <p className="text-xs text-gray-500">Total Requests</p>
                </button>
                <button
                    onClick={() => handleStatClick('resolved')}
                    className={`text-left bg-white rounded-xl border shadow-sm p-4 transition ${
                        activeFilter === 'resolved' ? 'border-purple-400 ring-2 ring-purple-100' : 'border-gray-200 hover:border-purple-200'
                    }`}
                >
                    <p className="text-2xl font-bold text-gray-900">{resolved}</p>
                    <p className="text-xs text-gray-500">Resolved Requests ({resolvedPct}%)</p>
                </button>
                <button
                    onClick={() => handleStatClick('agents')}
                    className="text-left bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:border-purple-200 transition"
                >
                    <p className="text-2xl font-bold text-gray-900">{Object.keys(byAgent).length}</p>
                    <p className="text-xs text-gray-500">Active Agents</p>
                </button>
            </div>

            {activeFilter && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
                    <h2 className="font-bold text-gray-900 mb-3">
                        {activeFilter === 'total' ? 'All Requests' : 'Resolved Requests'}
                    </h2>
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="text-left text-gray-500 border-b border-gray-100">
                            <th className="py-2">Ticket ID</th>
                            <th>Request</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Assigned To</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredRows.map((r) => (
                            <tr key={r.id} className="border-b border-gray-50 last:border-0">
                                <td className="py-2">#{r.id}</td>
                                <td>{r.description}</td>
                                <td>{r.category || 'Unclassified'}</td>
                                <td>{r.status.replace(/_/g, ' ')}</td>
                                <td>{r.assignedToName || 'Unassigned'}</td>
                            </tr>
                        ))}
                        {filteredRows.length === 0 && (
                            <tr><td colSpan={5} className="py-4 text-center text-gray-400">Nothing here.</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <h2 className="font-bold text-gray-900 mb-3">Requests by Category</h2>
                    <div className="space-y-2">
                        {Object.entries(byCategory).map(([cat, count]) => (
                            <div key={cat} className="flex items-center gap-2">
                                <span className="text-xs text-gray-600 w-32 shrink-0">{cat}</span>
                                <div className="flex-1 bg-purple-50 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-purple-500 to-purple-700 h-2 rounded-full"
                                        style={{ width: `${(count / maxCategoryCount) * 100}%` }}
                                    />
                                </div>
                                <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
                            </div>
                        ))}
                        {Object.keys(byCategory).length === 0 && <p className="text-gray-400 text-sm">No data yet.</p>}
                    </div>
                </div>

                <div ref={agentTableRef} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <h2 className="font-bold text-gray-900 mb-3">Support Team Performance</h2>
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="text-left text-gray-500 border-b border-gray-100">
                            <th className="py-2">Agent</th>
                            <th>Open</th>
                            <th>Resolved</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Object.entries(byAgent).map(([agent, counts]) => (
                            <tr key={agent} className="border-b border-gray-50 last:border-0">
                                <td className="py-2">{agent}</td>
                                <td>{counts.open}</td>
                                <td>{counts.resolved}</td>
                            </tr>
                        ))}
                        {Object.keys(byAgent).length === 0 && (
                            <tr><td colSpan={3} className="py-4 text-center text-gray-400">No assigned agents yet.</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Reports