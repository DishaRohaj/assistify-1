import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiRequest } from '../api/client'

function AgentTicketDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [ticket, setTicket] = useState(null)
    const [agents, setAgents] = useState([])
    const [resolutionSummary, setResolutionSummary] = useState('')
    const [escalateTo, setEscalateTo] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [moreInfoMessage, setMoreInfoMessage] = useState('')
    const [moreInfoLoading, setMoreInfoLoading] = useState(false)
    const [moreInfoError, setMoreInfoError] = useState('')

    const load = () => {
        apiRequest(`/requests/${id}`).then(setTicket).catch(console.error)
        apiRequest('/requests/agents').then((all) => setAgents(all.filter(a => a.role === 'L2_SUPPORT'))).catch(console.error)
    }

    useEffect(() => { load() }, [id])

    const handleResolve = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await apiRequest(`/requests/${id}/resolve`, {
                method: 'PUT',
                body: { resolutionSummary },
            })
            navigate('/agent/my-tickets')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleEscalate = async () => {
        setError('')
        setLoading(true)
        try {
            await apiRequest(`/requests/${id}/escalate`, {
                method: 'PUT',
                body: { l2AgentId: escalateTo || null },
            })
            navigate('/agent/my-tickets')
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
            navigate('/agent/my-tickets')
        } catch (err) {
            setMoreInfoError(err.message)
        } finally {
            setMoreInfoLoading(false)
        }
    }

    if (!ticket) return <div>Loading...</div>

    const canRequestMoreInfo = ticket.status !== 'NEED_MORE_INFO' && ticket.status !== 'CLOSED'

    return (
        <div className="max-w-3xl">
            <button onClick={() => navigate('/agent/my-tickets')} className="text-sm text-purple-600 mb-4">← Back to My Tickets</button>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-purple-600 font-bold">#{ticket.id}</p>
                        <h1 className="text-xl font-bold text-gray-900">{ticket.description}</h1>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        {ticket.status.replace(/_/g, ' ')}
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                        <p className="text-gray-400">Requester</p>
                        <p className="font-medium text-gray-900">{ticket.raisedByName || '-'}</p>
                        <p className="text-gray-500">{ticket.raisedByEmail || '-'}</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Category / Priority</p>
                        <p className="font-medium text-gray-900">{ticket.category || '-'} / {ticket.priority || '-'}</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Preferred Contact Method</p>
                        <p className="font-medium text-gray-900">
                            {ticket.contactPreference || '-'}
                            {ticket.contactPreference === 'Phone' && ticket.phoneNumber ? ` (${ticket.phoneNumber})` : ''}
                        </p>
                    </div>
                </div>

                {ticket.escalatedByName && (
                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-amber-700 mb-1">Escalated by</p>
                        <p className="text-sm text-amber-700">{ticket.escalatedByName}</p>
                    </div>
                )}

                {ticket.status === 'NEED_MORE_INFO' && ticket.moreInfoRequest && (
                    <div className="mt-4 bg-cyan-50 border border-cyan-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-cyan-700 mb-1">Waiting on requester for</p>
                        <p className="text-sm text-cyan-800">{ticket.moreInfoRequest}</p>
                    </div>
                )}

                {ticket.moreInfoResponse && (
                    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-gray-500 mb-1">Requester's Response</p>
                        <p className="text-sm text-gray-700">{ticket.moreInfoResponse}</p>
                    </div>
                )}

                {ticket.status === 'REOPENED' && ticket.reopenReason && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-red-700 mb-1">Reopened by requester</p>
                        <p className="text-sm text-red-700">{ticket.reopenReason}</p>
                    </div>
                )}
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{error}</p>}

            {canRequestMoreInfo && (
                <div className="bg-white rounded-xl border border-cyan-200 shadow-sm p-6 space-y-4 mb-6">
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

            <form onSubmit={handleResolve} className="bg-white rounded-xl border border-green-200 shadow-sm p-6 space-y-4 mb-6">
                <h2 className="font-bold text-gray-900">Resolve Ticket</h2>
                <textarea
                    value={resolutionSummary}
                    onChange={(e) => setResolutionSummary(e.target.value)}
                    placeholder="Describe the technical resolution provided to the requester..."
                    rows={3}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                />
                <p className="text-xs text-gray-400">After resolving, the ticket moves to Pending User Confirmation — the requester must confirm before it's Closed.</p>
                <button type="submit" disabled={loading} className="bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-60">
                    Mark as Resolved
                </button>
            </form>

            {ticket.assignedToRole === 'L1_SUPPORT' && (
                <div className="bg-white rounded-xl border border-red-200 shadow-sm p-6 space-y-4">
                    <h2 className="font-bold text-gray-900">Escalate to L2</h2>
                    <select
                        value={escalateTo}
                        onChange={(e) => setEscalateTo(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                    >
                        <option value="">Select L2 agent</option>
                        {agents.map((a) => <option key={a.id} value={a.id}>{a.fullName}</option>)}
                    </select>
                    <button onClick={handleEscalate} disabled={loading} className="bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-60">
                        Escalate to L2
                    </button>
                </div>
            )}
        </div>
    )
}

export default AgentTicketDetail