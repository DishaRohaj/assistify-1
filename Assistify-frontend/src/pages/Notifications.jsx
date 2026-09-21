import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ArrowLeft, CheckCheck } from 'lucide-react'
import { apiRequest } from '../api/client'

function timeAgo(dateString) {
    const date = new Date(dateString)
    const seconds = Math.floor((new Date() - date) / 1000)
    if (seconds < 60) return 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
}

function Notifications() {
    const navigate = useNavigate()
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)

    const load = () => {
        setLoading(true)
        apiRequest('/notifications')
            .then(setNotifications)
            .catch(console.error)
            .finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [])

    const handleClick = async (n) => {
        if (!n.read) {
            try {
                await apiRequest(`/notifications/${n.id}/read`, { method: 'PUT' })
                setNotifications((prev) =>
                    prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                )
            } catch (err) {
                console.error(err)
            }
        }
        if (n.relatedRequestId) {
            navigate(`/my-request/${n.relatedRequestId}`)
        }
    }

    const markAllRead = async () => {
        try {
            await apiRequest('/notifications/read-all', { method: 'PUT' })
            setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))
        } catch (err) {
            console.error(err)
        }
    }

    const unreadCount = notifications.filter((n) => !n.read).length

    return (
        <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                        </p>
                    </div>
                </div>

                {unreadCount > 0 && (
                    <button
                        onClick={markAllRead}
                        className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:underline"
                    >
                        <CheckCheck size={16} /> Mark all as read
                    </button>
                )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
                {loading && (
                    <p className="text-gray-500 text-sm p-6 text-center">Loading notifications...</p>
                )}

                {!loading && notifications.length === 0 && (
                    <div className="flex flex-col items-center text-center py-12">
                        <Bell size={32} className="text-gray-300 mb-3" />
                        <p className="text-gray-500 text-sm">No notifications yet.</p>
                    </div>
                )}

                {!loading && notifications.map((n) => (
                    <button
                        key={n.id}
                        onClick={() => handleClick(n)}
                        className={`w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-gray-50 transition ${
                            !n.read ? 'bg-purple-50/50' : ''
                        }`}
                    >
                        <span
                            className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                                !n.read ? 'bg-purple-600' : 'bg-transparent'
                            }`}
                        />
                        <div className="flex-1">
                            <p className={`text-sm ${!n.read ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                                {n.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Notifications