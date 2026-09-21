import { useNavigate } from 'react-router-dom'
import { Headphones, User2, BarChart3, Lock } from 'lucide-react'

const workspaces = [
    {
        key: 'service-desk',
        icon: Headphones,
        title: 'SERVICE DESK',
        desc: 'Review, validate, classify and assign incoming service requests.',
        bullets: ['Request Validation', 'Ticket Classification', 'Engineer Assignment'],
    },
    {
        key: 'it-agent',
        icon: User2,
        title: 'IT AGENT',
        subtitle: '[L1 / L2 Support]',
        desc: 'Troubleshoot assigned tickets, provide resolutions and escalate unresolved issues.',
        bullets: ['Assigned Tickets', 'Troubleshooting', 'L1 → L2 Escalation'],
    },
    {
        key: 'manager',
        icon: BarChart3,
        title: 'MANAGER',
        desc: 'Monitor support activity, team workload, SLA performance and service trends.',
        bullets: ['Team Workload', 'SLA Monitoring', 'Reports & Analytics'],
    },
]

function WorkspaceSelector() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-16 px-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Your Workspace</h1>
            <p className="text-gray-500 mb-10">Choose the workspace you want to access</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
                {workspaces.map(({ key, icon: Icon, title, subtitle, desc, bullets }) => (
                    <div key={key} className="bg-white border border-purple-200 rounded-2xl p-6 flex flex-col">
                        <Icon className="text-purple-500 mb-3" size={28} />
                        <h2 className="font-bold text-gray-900">
                            {title} {subtitle && <span className="text-sm font-normal text-gray-500">{subtitle}</span>}
                        </h2>
                        <p className="text-sm text-gray-500 mt-2 mb-4 flex-1">{desc}</p>
                        <ul className="text-sm text-gray-700 space-y-1 mb-6 list-disc list-inside">
                            {bullets.map((b) => <li key={b}>{b}</li>)}
                        </ul>
                        <button
                            onClick={() => navigate(`/staff-verify/${key}`)}
                            className="bg-purple-600 text-white rounded-full py-2 text-sm font-medium hover:bg-purple-700"
                        >
                            Continue →
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-10 border border-gray-200 rounded-xl px-6 py-3 flex items-center gap-2 text-sm text-gray-500 max-w-md text-center">
                <Lock size={14} /> Staff workspaces require additional verification before access.
            </div>
        </div>
    )
}

export default WorkspaceSelector