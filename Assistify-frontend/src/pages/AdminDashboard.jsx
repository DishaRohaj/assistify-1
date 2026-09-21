import { useEffect, useState } from 'react'
import { apiRequest } from '../api/client'
import { Users } from 'lucide-react'

function AdminDashboard() {
    const [users, setUsers] = useState([])

    useEffect(() => {
        apiRequest('/admin/users').then(setUsers).catch(console.error)
    }, [])

    const byRole = users.reduce((acc, u) => {
        acc[u.role] = (acc[u.role] || 0) + 1
        return acc
    }, {})

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mb-6">System overview and user distribution.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.entries(byRole).map(([role, count]) => (
                    <div key={role} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <Users className="text-purple-500 mb-2" size={20} />
                        <p className="text-2xl font-bold text-gray-900">{count}</p>
                        <p className="text-xs text-gray-500">{role.replace(/_/g, ' ')}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AdminDashboard