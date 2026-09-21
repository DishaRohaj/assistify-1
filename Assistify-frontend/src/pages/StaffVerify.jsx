import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Lock, Eye, EyeOff, Users } from 'lucide-react'

const destinations = {
    'service-desk': '/service-desk/dashboard',
    'it-agent': '/agent/dashboard',
    'manager': '/manager/dashboard',
}

function StaffVerify() {
    const { workspace } = useParams()
    const navigate = useNavigate()
    const [staffId, setStaffId] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        // This is a UX confirmation step, not a second authentication system —
        // real access control is already enforced by the role in the JWT from login.
        navigate(destinations[workspace] || '/dashboard')
    }

    return (
        <div className="min-h-screen flex">
            <div className="hidden lg:flex lg:w-1/2 bg-purple-400 flex-col items-center justify-center text-white px-16">
                <h2 className="text-2xl font-bold mb-8 text-center">Service desk Internal staff access</h2>
                <Users size={80} className="opacity-70" />
            </div>
            <div className="flex-1 flex items-center justify-center px-8">
                <form onSubmit={handleSubmit} className="w-full max-w-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <Lock className="text-yellow-500" size={22} />
                        <h1 className="text-2xl font-bold text-gray-900">Secure Staff Access</h1>
                    </div>

                    <label className="block text-sm font-semibold text-gray-800 mb-1">STAFF ID</label>
                    <input
                        type="text"
                        value={staffId}
                        onChange={(e) => setStaffId(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full border border-gray-300 rounded-full px-4 py-3 text-sm outline-none mb-5"
                    />

                    <label className="block text-sm font-semibold text-gray-800 mb-1">Password</label>
                    <div className="relative mb-5">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            className="w-full border border-gray-300 rounded-full px-4 py-3 text-sm outline-none"
                        />
                        <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <button type="submit" className="w-full bg-purple-600 text-white font-semibold py-3 rounded-full hover:bg-purple-700 mb-4">
                        Verify & Continue →
                    </button>

                    <p className="text-center text-xs text-gray-500">
                        Need help? Contact your system administrator.
                    </p>
                </form>
            </div>
        </div>
    )
}

export default StaffVerify