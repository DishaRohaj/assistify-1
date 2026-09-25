import { useEffect, useState } from 'react'
import { apiRequest } from '../api/client'
import { Clock, CheckCircle2, Headphones, Send, Bell, UserCircle, HelpCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


const statusColor = {
    OPEN: 'bg-purple-100 text-purple-700',
    ASSIGNED: 'bg-amber-100 text-amber-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    NEED_MORE_INFO: 'bg-cyan-100 text-cyan-700',
    RESOLVED: 'bg-green-100 text-green-700',
    PENDING_USER_CONFIRMATION: 'bg-orange-100 text-orange-700',
    CLOSED: 'bg-gray-200 text-gray-600',
    REOPENED: 'bg-red-100 text-red-700',
}

function Dashboard() {
    const [tickets, setTickets] = useState([])
    const [user, setUser] = useState(null)
    const [unreadCount, setUnreadCount] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        const storedUser =
            localStorage.getItem('user') ||
            sessionStorage.getItem('user')

        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }

        apiRequest('/requests').then(setTickets).catch(console.error)
    }, [])

    useEffect(() => {
        apiRequest('/notifications/unread-count')
            .then((data) => setUnreadCount(data.count))
            .catch(console.error)
    }, [])


    const stats = [
        {
            label: 'Open Tickets',
            value: tickets.filter(t => t.status === 'OPEN').length,
            color: 'border-purple-500',
            icon: Clock,
            iconColor: 'text-purple-500',
            filter: 'Open'
        },
        {
            label: 'In Progress',
            value: tickets.filter(t => t.status === 'IN_PROGRESS').length,
            color: 'border-blue-500',
            icon: CheckCircle2,
            iconColor: 'text-blue-500',
            filter: 'In Progress'
        },
        {
            label: 'Need More Info',
            value: tickets.filter(t => t.status === 'NEED_MORE_INFO').length,
            color: 'border-cyan-500',
            icon: HelpCircle,
            iconColor: 'text-cyan-500',
            filter: 'Need More Info'
        },
        {
            label: 'Waiting for Feedback',
            value: tickets.filter(t => t.status === 'PENDING_USER_CONFIRMATION').length,
            color: 'border-green-500',
            icon: CheckCircle2,
            iconColor: 'text-green-500',
            filter: 'Pending User Confirmation'
        },
        {
            label: 'Closed',
            value: tickets.filter(t => t.status === 'CLOSED').length,
            color: 'border-gray-400',
            icon: CheckCircle2,
            iconColor: 'text-gray-400',
            filter: 'Closed'
        },
    ]


    return (
        <div>
            <div className="flex items-center justify-between mb-6">

                <h1 className="text-2xl font-bold text-gray-900">
                    Hi, {user?.fullName || 'Employee'} how can we help you today?
                </h1>

                <div className="flex items-center gap-4">

                    <button
                        onClick={() => navigate('/notifications')}
                        className="relative text-gray-500 hover:text-purple-600 transition"
                        title="Notifications"
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => navigate('/user-profile')}
                        className="text-gray-500 hover:text-purple-600 transition"
                        title="User Profile"
                    >
                        <UserCircle size={28} />
                    </button>

                </div>


            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">

                        {stats.map(({ label, value, color, icon: Icon, iconColor, filter }) => (
                            <button
                                key={label}
                                onClick={() =>
                                    navigate(`/my-request?status=${encodeURIComponent(filter)}`)
                                }
                                className={`bg-white rounded-xl border-l-4 ${color} shadow-sm p-4 text-left w-full hover:shadow-md hover:-translate-y-0.5 transition`}
                            >
                                <Icon className={iconColor} size={20} />

                                <p className="text-2xl font-bold text-gray-900 mt-2">
                                    {String(value).padStart(2, '0')}
                                </p>

                                <p className="text-xs text-gray-500">
                                    {label}
                                </p>
                            </button>
                        ))}

                    </div>

                    <div className="bg-white rounded-xl border border-purple-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-1">
                            <Headphones className="text-purple-500" size={22} />
                            <h2 className="font-bold text-gray-900">How can we help you today?</h2>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                            Describe your problem and assistify will help you before you raise a service request
                        </p>
                        <input
                            type="text"
                            placeholder="Describe your problem (e.g.. CR, incident, etc)..."
                            className="w-full border border-gray-300 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                        <div className="flex justify-center mt-4">
                            <button onClick={() => navigate('/ai-support')} className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-purple-700">
                                <Send size={16} /> Ask Tara
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-500">Recent Tickets</span>
                            <button onClick={() => navigate('/my-request')} className="text-sm font-medium text-purple-600 hover:underline">View all tickets</button>
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="text-left text-gray-500 border-b border-gray-100">
                                <th className="py-2">Ticket ID</th>
                                <th>Issue</th>
                                <th>Category</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tickets.map((t) => (
                                <tr key={t.id} className="border-b border-gray-50 last:border-0">
                                    <td className="py-3">#{t.id}</td>
                                    <td>{t.description}</td>
                                    <td>{t.category || '-'}</td>
                                    <td>{t.priority || '-'}</td>
                                    <td>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[t.status] || 'bg-gray-100 text-gray-600'}`}>
                {t.status.replace(/_/g, ' ')}
            </span>
                                    </td>
                                    <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                                    <td><button onClick={() => navigate('/my-request')} className="text-purple-600 font-medium">View</button></td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                            <p className="font-semibold text-gray-900 text-sm mb-1">Having an IT problem?</p>
                            <p className="text-xs text-gray-500 mb-3">Raise a support ticket and our IT team will help you.</p>
                            <button onClick={() => navigate('/raise-request')} className="bg-purple-600 text-white text-xs font-medium px-3 py-2 rounded-full w-full">
                                + Raise Request
                            </button>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                            <p className="font-semibold text-gray-900 text-sm mb-1">Need Quick Help?</p>
                            <p className="text-xs text-gray-500 mb-3">Find troubleshooting steps or ask Assistify for help.</p>
                            <button onClick={() => navigate('/ai-support')} className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-2 rounded-full w-full">
                                Ask Tara
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                        <h3 className="font-bold text-gray-900 mb-1">Knowledge Base</h3>
                        <p className="text-xs text-gray-500 mb-3">Browse common IT solutions and troubleshooting guides.</p>
                        <ul className="text-sm text-gray-700 space-y-1 mb-4 list-disc list-inside">
                            <li>How to reset your password</li>
                            <li>VPN connection troubleshooting</li>
                            <li>Setting up your office printer</li>
                        </ul>
                        <button onClick={() => navigate('/knowledge-base')} className="bg-purple-100 text-purple-700 text-sm font-medium px-4 py-2 rounded-full w-full">
                            Browse Articles
                        </button>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col items-center text-center">
                        <Headphones className="text-purple-500 mb-2" size={28} />
                        <h3 className="font-bold text-gray-900">Help / Support</h3>
                        <p className="text-xs text-gray-500 mb-3">Need more assistance? Contact the Service Desk.</p>
                        <button onClick={() => navigate('/help-support')} className="bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-full w-full">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard