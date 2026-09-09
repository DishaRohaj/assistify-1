import { Search, Lock, Cloud, Settings, FileText } from 'lucide-react'

const categories = [
    { title: 'Security & login', subtitle: 'Resetting Passwords', icon: Lock },
    { title: 'Networking', subtitle: 'Setting up VPN', icon: Cloud },
    { title: 'Applications', subtitle: 'Using Assistify', icon: Settings },
]

const articles = [
    { title: 'How to clear browser cache', desc: 'How to clear browser cache, and free up space.', updated: 'Aug 2021' },
    { title: 'Connecting to VPN', desc: 'Connecting to VPN and troubleshooting.', updated: 'Aug 2021' },
    { title: 'Changing your password', desc: 'Changing and resetting your password.', updated: 'Aug 2021' },
    { title: 'Troubleshooting login issues', desc: 'Common login problems and fixes.', updated: 'Aug 2021' },
]

function KnowledgeBase() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Knowledge Base</h1>
            <p className="text-gray-500 mb-6">Access help articles and tutorials</p>

            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-3 mb-6">
                <Search size={18} className="text-gray-400" />
                <input
                    type="text"
                    placeholder="Search article (e.g. reset password, setting VPN)"
                    className="flex-1 text-sm outline-none"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {categories.map(({ title, subtitle, icon: Icon }) => (
                    <div key={title} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
                        <div className="bg-purple-100 p-3 rounded-full">
                            <Icon className="text-purple-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{title}</p>
                            <p className="font-bold text-gray-900">{subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {articles.map((a) => (
                    <div key={a.title} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg h-fit">
                            <FileText className="text-purple-600" size={18} />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 text-sm">{a.title}</p>
                            <p className="text-xs text-gray-500">{a.desc}</p>
                            <p className="text-xs text-gray-400 mt-1">Updated on {a.updated}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default KnowledgeBase