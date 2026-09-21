import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, Users2, BookOpen, Clock, BarChart2, LogOut } from 'lucide-react'
import logo from '../assets/logo.jpeg'

const navItems = [
    { to: '/service-desk/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/service-desk/requests', label: 'Service Requests', icon: FileText },
    { to: '/service-desk/assignment', label: 'Assignment', icon: Users2 },
    { to: '/service-desk/knowledge-base', label: 'Knowledge Base', icon: BookOpen },
    { to: '/service-desk/sla', label: 'SLA Monitoring', icon: Clock },
    { to: '/service-desk/reports', label: 'Reports', icon: BarChart2 },
]

function ServiceDeskLayout() {
    const navigate = useNavigate()
    const handleLogout = () => {
        localStorage.removeItem('token'); localStorage.removeItem('user')
        sessionStorage.removeItem('token'); sessionStorage.removeItem('user')
        navigate('/login')
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
                <div>
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                        <img src={logo} alt="Assistify" className="w-9 h-9" />
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">ASSISTIFY</h1>
                            <p className="text-xs text-gray-500">Intelligent IT Service Desk</p>
                        </div>
                    </div>
                    <nav className="mt-4 flex flex-col gap-1 px-3">
                        {navItems.map(({ to, label, icon: Icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                                    }`
                                }
                            >
                                <Icon size={18} />
                                {label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
                <div className="px-3 pb-4 border-t border-gray-100 pt-4">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 w-full">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto p-8">
                <Outlet />
            </main>
        </div>
    )
}

export default ServiceDeskLayout