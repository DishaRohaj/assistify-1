import { useEffect, useState } from 'react'
import { apiRequest } from '../api/client'

const roles = ['USER', 'SERVICE_DESK', 'L1_SUPPORT', 'L2_SUPPORT', 'MANAGER', 'ADMIN']

function AdminUsers() {
    const [users, setUsers] = useState([])
    const [error, setError] = useState('')

    const load = () => {
        apiRequest('/admin/users').then(setUsers).catch((e) => setError(e.message))
    }

    useEffect(() => { load() }, [])

    const handleRoleChange = async (userId, newRole) => {
        setError('')
        try {
            await apiRequest(`/admin/users/${userId}/role`, {
                method: 'PUT',
                body: { role: newRole },
            })
            load()
        } catch (err) {
            setError(err.message)
        }
    }

    const handleToggleActive = async (user) => {
        const nextActive = !user.active
        const confirmMsg = nextActive
            ? `Reactivate ${user.fullName}? They will be able to log in again.`
            : `Deactivate ${user.fullName}? They will not be able to log in until reactivated.`

        if (!confirm(confirmMsg)) return

        setError('')
        try {
            await apiRequest(`/admin/users/${user.id}/active`, {
                method: 'PUT',
                body: { active: nextActive },
            })
            load()
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">User Management</h1>
            <p className="text-gray-500 text-sm mb-6">Manage user accounts, roles, and access.</p>

            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{error}</p>}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100">
                        <th className="py-2">Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((u) => (
                        <tr key={u.id} className={`border-b border-gray-50 last:border-0 ${!u.active ? 'opacity-50' : ''}`}>
                            <td className="py-3">{u.fullName}</td>
                            <td>{u.email}</td>
                            <td>{u.department || '-'}</td>
                            <td>
                                <select
                                    value={u.role}
                                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                    disabled={!u.active}
                                    className="border border-gray-300 rounded-lg px-2 py-1 text-sm outline-none disabled:bg-gray-100"
                                >
                                    {roles.map((r) => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
                                </select>
                            </td>
                            <td>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    u.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                                }`}>
                                    {u.active ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td>
                                <button
                                    onClick={() => handleToggleActive(u)}
                                    className={`text-xs font-medium ${u.active ? 'text-red-600' : 'text-green-600'}`}
                                >
                                    {u.active ? 'Deactivate' : 'Reactivate'}
                                </button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && <tr><td colSpan={6} className="py-6 text-center text-gray-400">No users found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminUsers