import { useEffect, useState } from 'react'
import { apiRequest } from '../api/client'
import { Users } from 'lucide-react'

function AdminDashboard() {
    const [users, setUsers] = useState([])
    const [activeRole, setActiveRole] = useState(null)

    useEffect(() => {
        apiRequest('/admin/users').then(setUsers).catch(console.error)
    }, [])

    const byRole = users.reduce((acc, u) => {
        acc[u.role] = (acc[u.role] || 0) + 1
        return acc
    }, {})

    const filteredUsers = activeRole ? users.filter(u => u.role === activeRole) : []

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mb-6">System overview and user distribution.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                {Object.entries(byRole).map(([role, count]) => (
                    <button
                        key={role}
                        onClick={() => setActiveRole(activeRole === role ? null : role)}
                        className={`text-left bg-white rounded-xl border shadow-sm p-4 transition ${
                            activeRole === role
                                ? 'border-purple-400 ring-2 ring-purple-100'
                                : 'border-gray-200 hover:border-purple-200'
                        }`}
                    >
                        <Users className="text-purple-500 mb-2" size={20} />
                        <p className="text-2xl font-bold text-gray-900">{count}</p>
                        <p className="text-xs text-gray-500">{role.replace(/_/g, ' ')}</p>
                    </button>
                ))}
            </div>

            {activeRole && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <h2 className="font-bold text-gray-900 mb-3">
                        {activeRole.replace(/_/g, ' ')} Users
                    </h2>
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="text-left text-gray-500 border-b border-gray-100">
                            <th className="py-2">Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Location</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredUsers.map((u) => (
                            <tr key={u.id} className="border-b border-gray-50 last:border-0">
                                <td className="py-2">{u.fullName}</td>
                                <td>{u.email}</td>
                                <td>{u.department || '-'}</td>
                                <td>{u.location || '-'}</td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr><td colSpan={4} className="py-4 text-center text-gray-400">No users with this role.</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default AdminDashboard