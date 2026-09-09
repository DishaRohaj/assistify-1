import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, PlusCircle, Bot, BookOpen, HelpCircle, User, LogOut } from 'lucide-react'

const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/my-request', label: 'My Request', icon: ClipboardList },
    { to: '/raise-request', label: 'Raise Request', icon: PlusCircle },
    { to: '/ai-support', label: 'AI Support', icon: Bot },
    { to: '/knowledge-base', label: 'Knowledge Base', icon: BookOpen },
]

function UserLayout() {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
                <div>
                    <div className="px-6 py-5 border-b border-gray-100">
                        <h1 className="text-lg font-bold text-gray-900">ASSISTIFY</h1>
                        <p className="text-xs text-gray-500">Intelligent IT Service Desk</p>
                    </div>
                    <nav className="mt-4 flex flex-col gap-1 px-3">
                        {navItems.map(({ to, label, icon: Icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`
                                }
                            >
                                <Icon size={18} />
                                {label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="px-3 pb-4 flex flex-col gap-1 border-t border-gray-100 pt-4">
                    <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">
                        <HelpCircle size={18} /> Help / Support
                    </button>
                    <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">
                        <User size={18} /> User Profile
                    </button>
                    <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main content area — this is where each page renders */}
            <main className="flex-1 overflow-y-auto p-8">
                <Outlet />
            </main>
        </div>
    )
}

export default UserLayout