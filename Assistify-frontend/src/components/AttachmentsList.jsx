import { Paperclip, Download } from 'lucide-react'
import { downloadAttachment } from '../api/client'

function formatSize(bytes) {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function AttachmentsList({ requestId, attachments }) {
    if (!attachments || attachments.length === 0) return null

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-3">Attachments</h2>
            <ul className="space-y-2">
                {attachments.map((a) => (
                    <li key={a.id} className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2 min-w-0">
                            <Paperclip size={16} className="text-gray-400 shrink-0" />
                            <span className="text-sm text-gray-800 truncate">{a.fileName}</span>
                            <span className="text-xs text-gray-400 shrink-0">{formatSize(a.fileSize)}</span>
                        </div>
                        <button
                            onClick={() => downloadAttachment(requestId, a.id, a.fileName)}
                            className="flex items-center gap-1 text-purple-600 text-xs font-medium shrink-0"
                        >
                            <Download size={14} /> Download
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default AttachmentsList