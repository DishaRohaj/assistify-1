import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiRequest } from '../api/client'

function ServiceDeskRequestDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [request, setRequest] = useState(null)
    const [agents, setAgents] = useState([])
    const [category, setCategory] = useState('')
    const [priority, setPriority] = useState('')
    const [assignedToUserId, setAssignedToUserId] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        apiRequest(`/requests/${id}`).then((r) => {
            setRequest(r)
            setCategory(r.category || '')
            setPriority(r.priority || '')
        }).catch(console.error)
        apiRequest('/requests/agents').then(setAgents).catch(console.error)
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await apiRequest(`/requests/${id}/classify`, {
                method: 'PUT',
                body: { category, priority, assignedToUserId: assignedToUserId || null },
            })
            navigate('/service-desk/dashboard')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (!request) return <div className="p-8">Loading...</div>

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <button onClick={() => navigate('/service-desk/dashboard')} className="text-sm text-purple-600 mb-4">
                ← Back to Service Requests
            </button>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-purple-600 font-bold">#{request.id}</p>
                        <h1 className="text-xl font-bold text-gray-900">{request.description}</h1>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        {request.status}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                        <p className="text-gray-400">Requester</p>
                        <p className="font-medium text-gray-900">{request.raisedByName || '-'}</p>
                        <p className="text-gray-500">{request.raisedByEmail || '-'}</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Department / Location</p>
                        <p className="font-medium text-gray-900">
                            {request.raisedByDepartment || '-'} / {request.raisedByLocation || '-'}
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-purple-200 shadow-sm p-6 space-y-5 max-w-xl">
                <h2 className="font-bold text-gray-900">Validate & Classify Request</h2>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none">
                        <option value="">Select category</option>
                        <option value="NETWORK">Network & Internet</option>
                        <option value="EMAIL">Email</option>
                        <option value="HARDWARE">Hardware</option>
                        <option value="SOFTWARE">Software</option>
                        <option value="ACCESS_ACCOUNTS">Access & Accounts</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none">
                        <option value="">Select priority</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Agent</label>
                    <select value={assignedToUserId} onChange={(e) => setAssignedToUserId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none">
                        <option value="">Unassigned for now</option>
                        {agents.map((a) => (
                            <option key={a.id} value={a.id}>{a.fullName} ({a.role})</option>
                        ))}
                    </select>
                </div>

                {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

                <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white rounded-full py-2 text-sm font-medium disabled:opacity-60">
                    {loading ? 'Saving...' : 'Validate & Assign'}
                </button>
            </form>
        </div>
    )
}

export default ServiceDeskRequestDetail