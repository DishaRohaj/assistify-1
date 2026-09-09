import { useState } from 'react'
import { Paperclip } from 'lucide-react'

function RaiseRequest() {
    const [category, setCategory] = useState('')
    const [contact, setContact] = useState('Email')
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true) // later: call POST /api/requests here
    }

    return (
        <div>
            <p className="text-sm text-gray-400 mb-1">Employee Portal / Raise a Request</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Raise a Request</h1>
            <p className="text-gray-500 mb-6">Tell us what you need help with and our support team will assist you.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form */}
                <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-gray-900">Request Information</h2>
                        <span className="text-xs text-red-500">* Required fields</span>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            What do you need help with? <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                        >
                            <option value="">Select a service category</option>
                            <option>Network & Internet</option>
                            <option>Email</option>
                            <option>Hardware</option>
                            <option>Software</option>
                            <option>Access & Accounts</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Briefly describe the issue you are experiencing... <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Anything else that may help us understand the issue...
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Please include what happened, when it started and any error message you may have seen."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Attachment</label>
                        <button
                            type="button"
                            className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600"
                        >
                            <Paperclip size={16} /> Attach a file
                        </button>
                        <p className="text-xs text-gray-400 mt-1">
                            Optional — screenshots or relevant files can help our support team investigate the issue. Maximum file size: 10 MB.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            How should we contact you? <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-6">
                            {['Email', 'Phone', 'Internal Chat'].map((opt) => (
                                <label key={opt} className="flex items-center gap-2 text-sm text-gray-700">
                                    <input
                                        type="radio"
                                        name="contact"
                                        checked={contact === opt}
                                        onChange={() => setContact(opt)}
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>

                    {submitted && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-gray-700">
                            Request submitted successfully. Your request ID is <b>INC-10246</b>. You can track its progress from My Request.
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                        <button type="button" className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white">
                            Submit Request
                        </button>
                    </div>
                </form>

                {/* Your info panel */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-fit">
                    <h3 className="font-bold text-gray-900 mb-4">Your Information</h3>
                    <div className="space-y-3 text-sm">
                        <div>
                            <p className="text-gray-400">Name</p>
                            <p className="text-gray-900 font-medium">Rahul Sharma</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Employee ID</p>
                            <p className="text-gray-900 font-medium">EMP-1042</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Department</p>
                            <p className="text-gray-900 font-medium">Finance</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Email</p>
                            <p className="text-gray-900 font-medium">rahul.sharma@company.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RaiseRequest