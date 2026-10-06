import { useState, useRef } from 'react'
import { Paperclip, CheckCircle2 } from 'lucide-react'
import { apiRequest } from '../api/client'

function RaiseRequest() {
    const [category, setCategory] = useState('')
    const [contact, setContact] = useState('Email')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [description, setDescription] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [ticketId, setTicketId] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef(null)
    const [additionalDetails, setAdditionalDetails] = useState('')

    const currentUser = JSON.parse(
        localStorage.getItem('user') || sessionStorage.getItem('user') || 'null'
    )

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (submitted || loading) return

        setError('')
        setLoading(true)
        try {
            const data = await apiRequest('/requests', {
                method: 'POST',
                body: {
                    category,
                    description,
                    additionalDetails,
                    contactPreference: contact,
                    phoneNumber: contact === 'Phone' ? phoneNumber : null,
                },
            })
            setTicketId(data.id)

            if (selectedFile) {
                setUploading(true)
                try {
                    const formData = new FormData()
                    formData.append('file', selectedFile)

                    const token = localStorage.getItem('token') || sessionStorage.getItem('token')

                    const response = await fetch(
                        `${(import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')}/api/requests/${data.id}/attachments`,
                        {
                            method: 'POST',
                            headers: { Authorization: `Bearer ${token}` },
                            body: formData,
                        }
                    )

                    const attachmentData = await response.json().catch(() => null)

                    if (!response.ok) {
                        throw new Error(attachmentData?.error || 'File upload failed')
                    }
                } finally {
                    setUploading(false)
                }
            }

            setSubmitted(true)

        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setCategory('')
        setContact('Email')
        setPhoneNumber('')
        setSubmitted(false)
        setDescription('')
        setError('')
        setTicketId(null)
        setSelectedFile(null)
        setAdditionalDetails('')
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return (
        <div>
            <p className="text-sm text-gray-400 mb-1">Employee Portal / Raise a Request</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Raise a Request</h1>
            <p className="text-gray-500 mb-6">Tell us what you need help with and our support team will assist you.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-gray-900">Request Information</h2>
                        <span className="text-xs text-red-500">* Required fields</span>
                    </div>

                    <fieldset disabled={submitted} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                What do you need help with? <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none disabled:bg-gray-100"
                            >
                                <option value="">Select a service category</option>
                                <option value="NETWORK">Network & Internet</option>
                                <option value="EMAIL">Email</option>
                                <option value="HARDWARE">Hardware</option>
                                <option value="SOFTWARE">Software</option>
                                <option value="ACCESS_ACCOUNTS">Access & Accounts</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Briefly describe the issue you are experiencing... <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none disabled:bg-gray-100"
                                value={description} onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Anything else that may help us understand the issue...
                            </label>
                            <textarea
                                rows={3}
                                value={additionalDetails}
                                onChange={(e) => setAdditionalDetails(e.target.value)}
                                placeholder="Please include what happened, when it started and any error message you may have seen."
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none disabled:bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Attachment</label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]

                                    if (!file) return

                                    if (file.size > 10 * 1024 * 1024) {
                                        setError('File size cannot exceed 10 MB.')
                                        e.target.value = ''
                                        return
                                    }

                                    setError('')
                                    setSelectedFile(file)
                                }}
                            />

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                            >
                                <Paperclip size={16} />
                                {selectedFile ? 'Change file' : 'Attach a file'}
                            </button>

                            {selectedFile && (
                                <p className="text-sm text-gray-600 mt-2">
                                    Selected: <span className="font-medium">{selectedFile.name}</span>
                                </p>
                            )}

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

                            {contact === 'Phone' && (
                                <input
                                    type="tel"
                                    required
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="Enter your phone number"
                                    className="mt-3 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none disabled:bg-gray-100"
                                />
                            )}
                        </div>
                    </fieldset>

                    {submitted && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                            <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-green-800">
                                Request submitted successfully. Your request ID is <b>#{ticketId}</b>. You can track its progress from My Request.
                            </p>
                        </div>
                    )}
                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
                    )}

                    {submitted ? (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white"
                        >
                            Raise Another Request
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white disabled:opacity-60"
                        >
                            {loading
                                ? 'Submitting...'
                                : uploading
                                    ? 'Uploading...'
                                    : 'Submit Request'}
                        </button>
                    )}

                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                        <button type="button" className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700">
                            Cancel
                        </button>
                    </div>
                </form>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-fit">
                    <h3 className="font-bold text-gray-900 mb-4">Your Information</h3>
                    <div className="space-y-3 text-sm">
                        <div>
                            <p className="text-gray-400">Name</p>
                            <p className="text-gray-900 font-medium">{currentUser?.fullName || '-'}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Employee ID</p>
                            <p className="text-gray-900 font-medium">
                                {currentUser?.userId ? `EMP-${currentUser.userId}` : '-'}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400">Department</p>
                            <p className="text-gray-900 font-medium">{currentUser?.department || '-'}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Email</p>
                            <p className="text-gray-900 font-medium">{currentUser?.email || '-'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RaiseRequest