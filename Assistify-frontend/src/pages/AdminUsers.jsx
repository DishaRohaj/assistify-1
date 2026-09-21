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

    const handleDelete = async (userId) => {
        if (!confirm('Remove this user? This cannot be undone.')) return
        setError('')
        try {
            await apiRequest(`/admin/users/${userId}`, { method: 'DELETE' })
            load()
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">User Management</h1>
            <p className="text-gray-500 text-sm mb-6">Manage user accounts and role assignments.</p>

            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{error}</p>}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100">
                        <th className="py-2">Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((u) => (
                        <tr key={u.id} className="border-b border-gray-50 last:border-0">
                            <td className="py-3">{u.fullName}</td>
                            <td>{u.email}</td>
                            <td>{u.department || '—'}</td>
                            <td>
                                <select
                                    value={u.role}
                                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                    className="border border-gray-300 rounded-lg px-2 py-1 text-sm outline-none"
                                >
                                    {roles.map((r) => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
                                </select>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(u.id)} className="text-red-600 text-xs font-medium">Remove</button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-gray-400">No users found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminUsers