import { useState } from 'react'
import { Send } from 'lucide-react'

const quickPrompts = ['VPN Issue', 'Wi-Fi Network', 'Password Reset', 'Database Connectivity']

function AiSupport() {
    const [messages, setMessages] = useState([
        { from: 'tara', text: "Hi! I'm Tara. I can help you troubleshoot IT issues, find Knowledge Base answers, or create a ticket if unresolved." },
    ])
    const [input, setInput] = useState('')

    const sendMessage = (text) => {
        if (!text.trim()) return
        setMessages((prev) => [
            ...prev,
            { from: 'user', text },
            // placeholder reply — later this calls your real AI backend
            { from: 'tara', text: "Got it — let me look into that for you. (Real AI response coming once the backend is built.)" },
        ])
        setInput('')
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">AI Support</h1>
            <p className="text-gray-500 mb-6">Get instant help with common IT problems before raising a support ticket.</p>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6 space-y-3 max-h-96 overflow-y-auto">
                {messages.map((m, i) => (
                    <div key={i} className={m.from === 'tara' ? '' : 'flex justify-end'}>
                        <div
                            className={`inline-block max-w-md px-4 py-2 rounded-xl text-sm ${
                                m.from === 'tara'
                                    ? 'bg-purple-50 text-gray-800'
                                    : 'bg-purple-600 text-white'
                            }`}
                        >
                            {m.from === 'tara' && (
                                <p className="text-purple-600 font-semibold text-xs mb-1">Tara</p>
                            )}
                            {m.text}
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="font-bold text-gray-900 mb-3">What can I help you with today?</h2>
            <div className="flex flex-wrap gap-3 mb-6">
                {quickPrompts.map((p) => (
                    <button
                        key={p}
                        onClick={() => sendMessage(p)}
                        className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50"
                    >
                        {p}
                    </button>
                ))}
            </div>

            <div className="flex gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                    placeholder="Describe your problem (e.g.. My VPN is disconnected)..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none"
                />
                <button
                    onClick={() => sendMessage(input)}
                    className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2 rounded-lg text-sm font-medium"
                >
                    <Send size={16} /> Ask Tara
                </button>
            </div>
        </div>
    )
}

export default AiSupport