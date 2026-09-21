import { useEffect, useRef, useState } from 'react'
import { Send, Bot, Sparkles } from 'lucide-react'
import { apiRequest } from '../api/client'

const quickPrompts = [
    'My VPN is not connecting',
    'I cannot connect to Wi-Fi',
    'I forgot my password',
    'My Outlook login is not working',
    'My computer is running slowly',
]

function AiSupport() {
    const [messages, setMessages] = useState([
        {
            from: 'Tara',
            text: "Hi! I'm Tara 👋\nI can help you troubleshoot IT issues, find Knowledge Base solutions, or guide you to raise a support request if the issue isn't resolved.",
        },
    ])

    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)

    const messagesEndRef = useRef(null)

    // Automatically scroll to newest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth',
        })
    }, [messages, loading])

    const sendMessage = async (text) => {
        if (!text.trim() || loading) return

        const userMessage = text.trim()

        // Add user message
        setMessages((prev) => [
            ...prev,
            {
                from: 'user',
                text: userMessage,
            },
        ])

        setInput('')
        setLoading(true)

        try {
            const data = await apiRequest('/tara/ask', {
                method: 'POST',
                body: {
                    message: userMessage,
                },
            })

            setMessages((prev) => [
                ...prev,
                {
                    from: 'Tara',
                    text: data.response,
                    found: data.found,
                },
            ])
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    from: 'Tara',
                    text: `Sorry, I couldn't connect to the support system. ${error.message}`,
                },
            ])
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage(input)
        }
    }

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col">

            {/* Header */}
            <div className="mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">
                        <Bot
                            size={23}
                            className="text-purple-600"
                        />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            AI Support
                        </h1>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Tara is available
                        </div>
                    </div>
                </div>

                <p className="text-gray-500 mt-2">
                    Get instant help with common IT problems before raising a
                    support ticket.
                </p>
            </div>

            {/* Chat Container */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0">

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${
                                message.from === 'user'
                                    ? 'justify-end'
                                    : 'justify-start'
                            }`}
                        >

                            {/* Tara Avatar */}
                            {message.from === 'Tara' && (
                                <div className="flex-shrink-0 mr-3">
                                    <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                                        <Bot
                                            size={18}
                                            className="text-purple-600"
                                        />
                                    </div>
                                </div>
                            )}

                            <div
                                className={`max-w-[70%] ${
                                    message.from === 'user'
                                        ? 'items-end'
                                        : 'items-start'
                                } flex flex-col`}
                            >

                                {message.from === 'Tara' && (
                                    <span className="text-xs font-semibold text-purple-600 mb-1">
                                        Tara
                                    </span>
                                )}

                                <div
                                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                                        message.from === 'user'
                                            ? 'bg-purple-600 text-white rounded-br-md'
                                            : 'bg-gray-100 text-gray-800 rounded-bl-md'
                                    }`}
                                >
                                    {message.text}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Loading */}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="flex-shrink-0 mr-3">
                                <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                                    <Bot
                                        size={18}
                                        className="text-purple-600"
                                    />
                                </div>
                            </div>

                            <div>
                                <span className="text-xs font-semibold text-purple-600 mb-1 block">
                                    Tara
                                </span>

                                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Bottom Composer */}
                <div className="border-t border-gray-100 bg-white p-4">

                    {/* Quick Prompts */}
                    {/* Quick Prompts */}
                    {!loading && (
                        <div className="mb-3">
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2">
                                <Sparkles size={14} />
                                Try asking Tara
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {quickPrompts.map((prompt) => (
                                    <button
                                        key={prompt}
                                        onClick={() => sendMessage(prompt)}
                                        disabled={loading}
                                        className="px-3 py-2 text-xs border border-gray-200 rounded-lg text-gray-600 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 transition disabled:opacity-50"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="flex items-end gap-3 border border-gray-300 rounded-xl px-3 py-2 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100 transition">

                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                            rows={1}
                            placeholder="Describe your IT problem..."
                            className="flex-1 resize-none border-none outline-none text-sm text-gray-800 placeholder-gray-400 py-2 max-h-24"
                        />

                        <button
                            onClick={() => sendMessage(input)}
                            disabled={loading || !input.trim()}
                            className="w-10 h-10 flex-shrink-0 rounded-lg bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Send message"
                        >
                            <Send size={17} />
                        </button>
                    </div>

                    <p className="text-center text-xs text-gray-400 mt-2">
                        Tara uses Assistify's Knowledge Base to provide IT
                        support.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AiSupport