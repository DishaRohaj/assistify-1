import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiRequest } from '../api/client'
import AttachmentsList from '../components/AttachmentsList'

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
    const [moreInfoMessage, setMoreInfoMessage] = useState('')
    const [moreInfoLoading, setMoreInfoLoading] = useState(false)
    const [moreInfoError, setMoreInfoError] = useState('')

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

    const handleRequestMoreInfo = async () => {
        if (!moreInfoMessage.trim()) return
        setMoreInfoError('')
        setMoreInfoLoading(true)
        try {
            await apiRequest(`/requests/${id}/request-more-info`, {
                method: 'PUT',
                body: { message: moreInfoMessage },
            })
            navigate('/service-desk/dashboard')
        } catch (err) {
            setMoreInfoError(err.message)
        } finally {
            setMoreInfoLoading(false)
        }
    }

    if (!request) return <div className="p-8">Loading...</div>

    const canRequestMoreInfo = request.status !== 'NEED_MORE_INFO' && request.status !== 'CLOSED'

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
                        {request.status.replace(/_/g, ' ')}
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
                    <div>
                        <p className="text-gray-400">Preferred Contact Method</p>
                        <p className="font-medium text-gray-900">
                            {request.contactPreference || '-'}
                            {request.contactPreference === 'Phone' && request.phoneNumber ? ` (${request.phoneNumber})` : ''}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-400">Assigned To</p>
                        <p className="font-medium text-gray-900">{request.assignedToName || 'Not yet assigned'}</p>
                    </div>
                </div>

                {request.additionalDetails && (
                    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-gray-500 mb-1">Additional Details from Requester</p>
                        <p className="text-sm text-gray-700">{request.additionalDetails}</p>
                    </div>
                )}

                {request.status === 'NEED_MORE_INFO' && request.moreInfoRequest && (
                    <div className="mt-4 bg-cyan-50 border border-cyan-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-cyan-700 mb-1">Waiting on requester for</p>
                        <p className="text-sm text-cyan-800">{request.moreInfoRequest}</p>
                    </div>
                )}

                {request.moreInfoResponse && (
                    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-gray-500 mb-1">Requester's Response</p>
                        <p className="text-sm text-gray-700">{request.moreInfoResponse}</p>
                    </div>
                )}
            </div>


            <AttachmentsList requestId={id} attachments={request.attachments} className="mb-6" />

            {canRequestMoreInfo && (
                <div className="bg-white rounded-xl border border-cyan-200 shadow-sm p-6 space-y-4 max-w-xl mb-6">
                    <h2 className="font-bold text-gray-900">Need More Info from Requester?</h2>
                    <textarea
                        value={moreInfoMessage}
                        onChange={(e) => setMoreInfoMessage(e.target.value)}
                        placeholder="Describe what additional information you need from the requester..."
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                    />
                    {moreInfoError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{moreInfoError}</p>}
                    <button
                        onClick={handleRequestMoreInfo}
                        disabled={moreInfoLoading || !moreInfoMessage.trim()}
                        className="bg-cyan-600 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-60"
                    >
                        {moreInfoLoading ? 'Sending...' : 'Request More Info'}
                    </button>
                </div>
            )}

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

                    <div className="mt-2 bg-purple-50 border border-purple-100 rounded-lg p-3 text-xs text-gray-700 space-y-1.5">
                        <p><span className="font-semibold text-red-600">High</span> — Business-critical system down, multiple users affected, security issue, or complete work stoppage.</p>
                        <p><span className="font-semibold text-amber-600">Medium</span> — Single user affected, or a workaround exists but the user is still blocked.</p>
                        <p><span className="font-semibold text-gray-600">Low</span> — Minor/cosmetic issue, non-urgent request (e.g. new software install), no blocking impact.</p>
                    </div>
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