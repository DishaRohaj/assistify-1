import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../api/client'
import logo from '../assets/logo.jpeg'
import {
    Eye,
    EyeOff,
    Brain,
    ClipboardCheck,
    Users,
    ArrowRight
} from 'lucide-react'

const features = [
    {
        icon: Brain,
        title: 'AI-Powered Self Service',
        desc: 'Get instant help before raising a request.'
    },
    {
        icon: ClipboardCheck,
        title: 'Smart Request Management',
        desc: 'Track and manage IT support requests efficiently.'
    },
    {
        icon: Users,
        title: 'Faster Issue Resolution',
        desc: 'Connect requests with the right support team.'
    },
]

function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [remember, setRemember] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const data = await apiRequest('/auth/login', {
                method: 'POST',
                auth: false,
                body: { email, password },
            })


            localStorage.removeItem('token')
            localStorage.removeItem('user')
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('user')


            const storage = remember ? localStorage : sessionStorage
            storage.setItem('token', data.token)
            storage.setItem('user', JSON.stringify({
                userId: data.userId,
                email: data.email,
                role: data.role,
                fullName: data.fullName,
                department: data.department,
            }))




            const roleRoutes = {
                USER: '/dashboard',
                SERVICE_DESK: '/service-desk/dashboard',
                L1_SUPPORT: '/agent/dashboard',
                L2_SUPPORT: '/agent/dashboard',
                MANAGER: '/manager/dashboard',
                ADMIN: '/admin/dashboard',
            }

            navigate(roleRoutes[data.role] || '/dashboard')

        } catch (err) {
            setError(err.message || 'Invalid email or password.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex bg-white">

            {/* =====================================================
                LEFT PANEL
            ====================================================== */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#9694D2] relative flex-col px-6 xl:px-8 py-5 text-white">

                {/* ================= LOGO + BRAND ================= */}
                <div className="flex items-center gap-3 mb-12">

                    <img
                        src={logo}
                        alt="Assistify Logo"
                        className="w-14 h-14 object-contain rounded-md"
                    />

                    <div>
                        <h1 className="text-[28px] font-bold leading-none">
                            ASSISTIFY
                        </h1>

                        <p className="text-[13px] text-purple-100 mt-1">
                            Intelligent IT Service Desk
                        </p>
                    </div>

                </div>


                {/* =================================================
                    MAIN LEFT CONTENT

                    Heading + Features are inside the SAME container
                    so their alignment stays consistent.
                ================================================== */}
                <div className="w-[600px] max-w-full mx-auto mt-16">

                    {/* ================= MAIN HEADING ================= */}
                    <div className="w-full">
                        <h2 className="text-[28px] xl:text-[30px] font-extrabold text-gray-900 leading-tight text-center mb-10">
                            Smart, simple and efficient IT support.
                        </h2>
                    </div>


                    {/* ================= FEATURES ================= */}
                    <div className="flex flex-col space-y-6">

                        {features.map(({ icon: Icon, title, desc }) => (

                            <div
                                key={title}
                                className="flex items-center gap-5 w-full"
                            >

                                {/* Icon Box */}
                                <div className="w-[58px] h-[58px] bg-white rounded-lg flex items-center justify-center shrink-0">

                                    <Icon
                                        className="text-gray-800"
                                        size={32}
                                        strokeWidth={1.5}
                                    />

                                </div>


                                {/* Feature Text */}
                                <div>

                                    <p className="text-[15px] font-bold leading-tight text-white">
                                        {title}
                                    </p>

                                    <p className="text-[11px] text-purple-100 mt-1">
                                        {desc}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>


                {/* ================= ARROW ================= */}
                <button
                    type="button"
                    className="
                        absolute
                        -right-7
                        top-1/2
                        -translate-y-1/2
                        w-16
                        h-16
                        rounded-full
                        bg-white
                        flex
                        items-center
                        justify-center
                        shadow-md
                        z-10
                        transition-transform
                        duration-200
                        hover:scale-105
                    "
                >

                    <ArrowRight
                        className="text-[#8B4DFF]"
                        size={27}
                        strokeWidth={1.5}
                    />

                </button>

            </div>


            {/* =====================================================
                RIGHT PANEL
            ====================================================== */}
            <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 xl:px-20">

                <div className="w-full max-w-[340px]">

                    {/* ================= WELCOME ================= */}
                    <h2 className="text-[31px] font-extrabold text-[#8B4DFF] leading-tight mb-2">
                        Welcome !
                    </h2>

                    <p className="text-[10px] text-gray-600 mb-2">
                        Sign in to your Assistify account
                    </p>

                    <p className="text-[10px] text-gray-500 mb-7">
                        New to Assistify?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="text-[#8B4DFF] font-medium hover:underline"
                        >
                            Create an account
                        </button>
                    </p>


                    {/* ================= LOGIN FORM ================= */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >

                        {/* ================= EMAIL ================= */}
                        <div>

                            <label className="block text-[11px] font-bold text-gray-800 mb-2">
                                User ID / Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className="
                                    w-full
                                    h-[35px]
                                    border
                                    border-gray-300
                                    rounded-full
                                    px-4
                                    text-[10px]
                                    text-gray-700
                                    outline-none
                                    focus:border-[#8B4DFF]
                                    focus:ring-1
                                    focus:ring-[#8B4DFF]
                                "
                            />

                        </div>


                        {/* ================= PASSWORD ================= */}
                        <div>

                            <label className="block text-[11px] font-bold text-gray-800 mb-2">
                                Password
                            </label>

                            <div className="relative">

                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    className="
                                        w-full
                                        h-[35px]
                                        border
                                        border-gray-300
                                        rounded-full
                                        px-4
                                        pr-10
                                        text-[10px]
                                        text-gray-700
                                        outline-none
                                        focus:border-[#8B4DFF]
                                        focus:ring-1
                                        focus:ring-[#8B4DFF]
                                    "
                                />


                                {/* Show / Hide Password */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-400
                                        hover:text-gray-600
                                    "
                                >

                                    {showPassword ? (
                                        <EyeOff size={15} />
                                    ) : (
                                        <Eye size={15} />
                                    )}

                                </button>

                            </div>

                        </div>


                        {/* ================= REMEMBER + FORGOT ================= */}
                        <div className="flex justify-between items-center pt-1">

                            <label className="flex items-center gap-2 text-[9px] text-gray-500 cursor-pointer">

                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) =>
                                        setRemember(e.target.checked)
                                    }
                                    className="
                                        w-3.5
                                        h-3.5
                                        rounded-full
                                        accent-[#8B4DFF]
                                    "
                                />

                                Remember me

                            </label>


                            <a
                                href="#"
                                className="
                                    text-[9px]
                                    text-gray-700
                                    hover:text-[#8B4DFF]
                                "
                            >
                                Forgot Password?
                            </a>

                        </div>


                        {/* ================= LOGIN BUTTON ================= */}
                        {/* ================= ERROR ================= */}
                        {error && (
                            <p className="text-[10px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}

                        {/* ================= LOGIN BUTTON ================= */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full
                                h-[35px]
                                bg-[#8B4DFF]
                                text-white
                                text-[10px]
                                font-medium
                                rounded-full
                                hover:bg-[#793de8]
                                transition
                                disabled:opacity-60
                            "
                        >
                            {loading ? 'Signing in...' : 'Login'}
                        </button>


                        {/* ================= HELP ================= */}
                        <div className="border-t border-gray-300 mt-3 pt-3 text-center">

                            <p className="text-[9px] text-gray-600 leading-4">

                                Need help accessing your account?
                                <br />

                                <a
                                    href="#"
                                    className="text-[#8B4DFF] font-medium"
                                >
                                    Contact Service Desk
                                </a>

                            </p>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    )
}

export default Login