import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../api/client'
import logo from '../assets/logo.jpeg'

function Register() {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
        department: '',
        location: '',
    })

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError('')
        setSuccess('')
        setLoading(true)

        try {
            await apiRequest('/auth/register', {
                method: 'POST',
                auth: false,
                body: form,
            })

            setSuccess('Account created successfully! Redirecting to login...')

            setTimeout(() => {
                navigate('/login')
            }, 1500)

        } catch (err) {
            setError(err.message || 'Unable to create account.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

                {/* Logo */}
                <div className="flex flex-col items-center mb-6">
                    <img
                        src={logo}
                        alt="Assistify Logo"
                        className="w-14 h-14 object-contain rounded-md mb-3"
                    />

                    <h1 className="text-2xl font-bold text-gray-900">
                        Create your account
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Register as an Assistify user
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                            className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm outline-none focus:border-[#8B4DFF] focus:ring-1 focus:ring-[#8B4DFF]"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Work Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter your work email"
                            required
                            className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm outline-none focus:border-[#8B4DFF] focus:ring-1 focus:ring-[#8B4DFF]"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            required
                            className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm outline-none focus:border-[#8B4DFF] focus:ring-1 focus:ring-[#8B4DFF]"
                        />
                    </div>

                    {/* Department */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Department
                        </label>

                        <input
                            type="text"
                            name="department"
                            value={form.department}
                            onChange={handleChange}
                            placeholder="e.g. Finance, HR, Operations"
                            required
                            className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm outline-none focus:border-[#8B4DFF] focus:ring-1 focus:ring-[#8B4DFF]"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                        </label>

                        <input
                            type="text"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="e.g. Site A"
                            required
                            className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm outline-none focus:border-[#8B4DFF] focus:ring-1 focus:ring-[#8B4DFF]"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    {/* Success */}
                    {success && (
                        <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                            {success}
                        </p>
                    )}

                    {/* Create Account */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-10 bg-[#8B4DFF] text-white rounded-lg text-sm font-medium hover:bg-[#793de8] transition disabled:opacity-60"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>

                </form>

                {/* Login */}
                <div className="text-center mt-5 pt-5 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-[#8B4DFF] font-medium hover:underline"
                        >
                            Sign in
                        </button>
                    </p>
                </div>

            </div>
        </div>
    )
}

export default Register