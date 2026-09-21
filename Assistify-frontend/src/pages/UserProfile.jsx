import { useEffect, useState } from 'react'
import { User, Mail, Shield, Building2, ArrowLeft, Pencil, Check, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../api/client'

function UserProfile() {

    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [editingDept, setEditingDept] = useState(false)
    const [deptInput, setDeptInput] = useState('')
    const [saving, setSaving] = useState(false)
    const [saveError, setSaveError] = useState('')

    useEffect(() => {
        const storedUser =
            localStorage.getItem('user') ||
            sessionStorage.getItem('user')

        if (storedUser) {
            const parsed = JSON.parse(storedUser)
            setUser(parsed)
            setDeptInput(parsed.department || '')
        }
    }, [])

    const saveDepartment = async () => {
        setSaving(true)
        setSaveError('')
        try {
            await apiRequest('/users/me', {
                method: 'PUT',
                body: { department: deptInput },
            })

            const updatedUser = { ...user, department: deptInput }
            setUser(updatedUser)

            const storageArea = localStorage.getItem('user') ? localStorage : sessionStorage
            storageArea.setItem('user', JSON.stringify(updatedUser))

            setEditingDept(false)
        } catch (err) {
            setSaveError(err.message || 'Failed to update department.')
        } finally {
            setSaving(false)
        }
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Unable to load profile.</p>
            </div>
        )
    }

    return (
        <div className="max-w-3xl">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">

                <button
                    onClick={() => navigate('/dashboard')}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                >
                    <ArrowLeft size={20} />
                </button>

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        User Profile
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View your Assistify account information.
                    </p>
                </div>

            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

                {/* Avatar */}
                <div className="flex items-center gap-4 pb-6 border-b border-gray-100">

                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                        <User
                            size={32}
                            className="text-purple-600"
                        />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {user.fullName || 'User'}
                        </h2>

                        <p className="text-sm text-gray-500">
                            Assistify User
                        </p>
                    </div>

                </div>

                {/* Account Information */}
                <div className="mt-6">

                    <h3 className="font-semibold text-gray-900 mb-4">
                        Account Information
                    </h3>

                    <div className="space-y-4">

                        {/* Name */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">

                            <User
                                size={20}
                                className="text-purple-600"
                            />

                            <div>
                                <p className="text-xs text-gray-500">
                                    Full Name
                                </p>

                                <p className="text-sm font-medium text-gray-900">
                                    {user.fullName || 'â€”'}
                                </p>
                            </div>

                        </div>

                        {/* Email */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">

                            <Mail
                                size={20}
                                className="text-purple-600"
                            />

                            <div>
                                <p className="text-xs text-gray-500">
                                    Email Address
                                </p>

                                <p className="text-sm font-medium text-gray-900">
                                    {user.email || 'â€”'}
                                </p>
                            </div>

                        </div>

                        {/* Role */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">

                            <Shield
                                size={20}
                                className="text-purple-600"
                            />

                            <div>
                                <p className="text-xs text-gray-500">
                                    Account Role
                                </p>

                                <p className="text-sm font-medium text-gray-900">
                                    {user.role || 'USER'}
                                </p>
                            </div>

                        </div>

                        {/* Department */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">

                            <Building2
                                size={20}
                                className="text-purple-600"
                            />

                            <div className="flex-1">
                                <p className="text-xs text-gray-500">
                                    Department
                                </p>

                                {editingDept ? (
                                    <div className="flex items-center gap-2 mt-1">
                                        <input
                                            type="text"
                                            value={deptInput}
                                            onChange={(e) => setDeptInput(e.target.value)}
                                            placeholder="Enter your department"
                                            className="border border-gray-300 rounded-lg px-2 py-1 text-sm outline-none focus:border-purple-500"
                                        />
                                        <button
                                            onClick={saveDepartment}
                                            disabled={saving}
                                            className="p-1 rounded bg-purple-600 text-white disabled:opacity-50"
                                            title="Save"
                                        >
                                            <Check size={14} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingDept(false)
                                                setDeptInput(user.department || '')
                                                setSaveError('')
                                            }}
                                            className="p-1 rounded border border-gray-300 text-gray-600"
                                            title="Cancel"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-gray-900">
                                            {user.department || 'Not set'}
                                        </p>
                                        <button
                                            onClick={() => setEditingDept(true)}
                                            className="text-purple-600 hover:text-purple-800"
                                            title="Edit department"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                    </div>
                                )}

                                {saveError && (
                                    <p className="text-xs text-red-600 mt-1">{saveError}</p>
                                )}
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default UserProfile