import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Bot,
    BookOpen,
    PlusCircle,
    Mail,
    Phone,
    ChevronDown,
    LifeBuoy,
} from 'lucide-react'

const faqs = [
    {
        q: 'How do I raise a new support request?',
        a: 'Go to "Raise Request" from the sidebar, select a category, describe your issue, and submit. You will get a Ticket ID to track its progress from "My Request".',
    },
    {
        q: 'Can Tara (AI Support) solve my problem instantly?',
        a: 'Tara searches the Knowledge Base for a matching solution to common issues like VPN, Wi-Fi, and login problems. If Tara cannot find a solution, you can raise a support request directly from the chat.',
    },
    {
        q: 'How do I check the status of my request?',
        a: 'Open "My Request" from the sidebar. You can filter by status (Open, Assigned, In Progress, Resolved, Pending Confirmation, Closed) and click "View" on any ticket for full details.',
    },
    {
        q: 'What happens after my request is marked Resolved?',
        a: 'Your ticket moves to "Pending User Confirmation". Please confirm the fix worked so it can be closed, or reopen it if the issue persists.',
    },
    {
        q: 'Who do I contact for urgent issues?',
        a: 'For urgent issues outside normal support hours, please use the phone number listed below to reach the IT Service Desk directly.',
    },
]

function HelpSupport() {
    const navigate = useNavigate()
    const [openFaq, setOpenFaq] = useState(null)

    const quickLinks = [
        {
            label: 'Ask Tara (AI Support)',
            desc: 'Get instant help for common IT problems.',
            icon: Bot,
            action: () => navigate('/ai-support'),
        },
        {
            label: 'Browse Knowledge Base',
            desc: 'Find step-by-step solutions to known issues.',
            icon: BookOpen,
            action: () => navigate('/knowledge-base'),
        },
        {
            label: 'Raise a Support Request',
            desc: "Can't find a solution? Let our Service Desk help.",
            icon: PlusCircle,
            action: () => navigate('/raise-request'),
        },
    ]

    return (
        <div className="max-w-4xl">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">
                    <LifeBuoy size={22} className="text-purple-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Help / Support</h1>
                    <p className="text-gray-500 mt-1">
                        Find answers, get instant help, or reach out to our Service Desk.
                    </p>
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {quickLinks.map(({ label, desc, icon: Icon, action }) => (
                    <button
                        key={label}
                        onClick={action}
                        className="text-left bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:border-purple-300 hover:shadow-md transition"
                    >
                        <Icon size={22} className="text-purple-600 mb-3" />
                        <p className="font-semibold text-gray-900 text-sm">{label}</p>
                        <p className="text-xs text-gray-500 mt-1">{desc}</p>
                    </button>
                ))}
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
                <h2 className="font-bold text-gray-900 mb-4">Contact the IT Service Desk</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                            <Mail size={16} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm font-medium text-gray-900">servicedesk@assistify.com</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                            <Phone size={16} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Phone (Urgent Issues)</p>
                            <p className="text-sm font-medium text-gray-900">+91 1800-123-4567</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                <div className="divide-y divide-gray-100">
                    {faqs.map((item, index) => (
                        <div key={index} className="py-3">
                            <button
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                className="w-full flex items-center justify-between text-left"
                            >
                                <span className="text-sm font-medium text-gray-900">{item.q}</span>
                                <ChevronDown
                                    size={16}
                                    className={`text-gray-400 transition-transform ${
                                        openFaq === index ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>
                            {openFaq === index && (
                                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                                    {item.a}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default HelpSupport