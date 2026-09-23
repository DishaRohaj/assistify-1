import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, RotateCcw } from 'lucide-react'
import { apiRequest } from '../api/client'
import AttachmentsList from '../components/AttachmentsList'

const statusColor = {
    OPEN: 'bg-purple-100 text-purple-700',
    ASSIGNED: 'bg-amber-100 text-amber-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    RESOLVED: 'bg-green-100 text-green-700',
    PENDING_USER_CONFIRMATION: 'bg-orange-100 text-orange-700',
    CLOSED: 'bg-gray-200 text-gray-600',
    REOPENED: 'bg-red-100 text-red-700',
}

function RequestDetail() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [ticket, setTicket] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [actionLoading, setActionLoading] = useState(false)
    const [showReopenBox, setShowReopenBox] = useState(false)
    const [reopenReason, setReopenReason] = useState('')

    const load = () => {
        setLoading(true)
        setError('')
        apiRequest(`/requests/${id}`)
            .then(setTicket)
            .catch((err) => setError(err.message || 'Failed to load request.'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [id])

    const handleConfirm = async () => {
        setActionLoading(true)
        setError('')
        try {
            const updated = await apiRequest(`/requests/${id}/confirm`, { method: 'PUT' })
            setTicket(updated)
        } catch (err) {
            setError(err.message || 'Failed to confirm resolution.')
        } finally {
            setActionLoading(false)
        }
    }

    const handleReopen = async () => {
        if (!reopenReason.trim()) return
        setActionLoading(true)
        setError('')
        try {
            const updated = await apiRequest(`/requests/${id}/reopen`, {
                method: 'PUT',
                body: { reason: reopenReason },
            })
            setTicket(updated)
            setShowReopenBox(false)
            setReopenReason('')
        } catch (err) {
            setError(err.message || 'Failed to reopen request.')
        } finally {
            setActionLoading(false)
        }
    }

    return (
        <div className="max-w-3xl">

            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => navigate('/my-request')}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                >
                    <ArrowLeft size={20} />
                </button>

                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Request #{id}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        View the details of your support request.
                    </p>
                </div>
            </div>

            {loading && (
                <p className="text-gray-500">Loading request details...</p>
            )}

            {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
                    {error}
                </p>
            )}

            {ticket && !loading && (
                <div className="space-y-6">

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">

                        <div>
                            <p className="text-xs text-gray-500 mb-1">Status</p>
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                    statusColor[ticket.status] || 'bg-gray-100 text-gray-600'
                                }`}
                            >
                                {ticket.status.replace(/_/g, ' ')}
                            </span>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 mb-1">Description</p>
                            <p className="text-sm text-gray-900">{ticket.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Category</p>
                                <p className="text-sm text-gray-900">{ticket.category || 'Not classified yet'}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 mb-1">Priority</p>
                                <p className="text-sm text-gray-900">{ticket.priority || 'Not set yet'}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 mb-1">Created on</p>
                                <p className="text-sm text-gray-900">
                                    {new Date(ticket.createdAt).toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 mb-1">Last updated</p>
                                <p className="text-sm text-gray-900">
                                    {ticket.updatedAt
                                        ? new Date(ticket.updatedAt).toLocaleString()
                                        : 'Not yet updated'}
                                </p>
                            </div>
                        </div>

                    </div>

                    {ticket.resolutionSummary && (
                        <div className="bg-white rounded-xl border border-green-200 shadow-sm p-6">
                            <h2 className="font-bold text-gray-900 mb-2">Resolution Note</h2>
                            <p className="text-sm text-gray-700">{ticket.resolutionSummary}</p>
                        </div>
                    )}
                    <AttachmentsList requestId={id} attachments={ticket.attachments} />

                    {ticket.status === 'PENDING_USER_CONFIRMATION' && (
                        <div className="bg-white rounded-xl border border-orange-200 shadow-sm p-6 space-y-4">
                            <h2 className="font-bold text-gray-900">Is your issue resolved?</h2>
                            <p className="text-sm text-gray-600">
                                Please confirm if the fix above solved your problem, or reopen the ticket if it did not.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleConfirm}
                                    disabled={actionLoading}
                                    className="flex items-center gap-2 bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-60"
                                >
                                    <Check size={16} /> Confirm Fixed
                                </button>
                                <button
                                    onClick={() => setShowReopenBox((prev) => !prev)}
                                    disabled={actionLoading}
                                    className="flex items-center gap-2 border border-red-300 text-red-600 text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-60"
                                >
                                    <RotateCcw size={16} /> Reopen
                                </button>
                            </div>

                            {showReopenBox && (
                                <div className="pt-2 space-y-2">
                                    <textarea
                                        value={reopenReason}
                                        onChange={(e) => setReopenReason(e.target.value)}
                                        placeholder="Tell us why the issue isn't resolved..."
                                        rows={3}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                                    />
                                    <button
                                        onClick={handleReopen}
                                        disabled={actionLoading || !reopenReason.trim()}
                                        className="bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-60"
                                    >
                                        Submit Reopen Reason
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {ticket.status === 'REOPENED' && ticket.reopenReason && (
                        <div className="bg-white rounded-xl border border-red-200 shadow-sm p-6">
                            <h2 className="font-bold text-gray-900 mb-2">Your Reopen Reason</h2>
                            <p className="text-sm text-gray-700">{ticket.reopenReason}</p>
                            <p className="text-xs text-gray-400 mt-2">The support team has been notified and will follow up.</p>
                        </div>
                    )}

                </div>
            )}

        </div>
    )
}

export default RequestDetail