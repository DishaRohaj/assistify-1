import { useEffect, useState } from 'react'
import { apiRequest } from '../api/client'
import { Search, FileText, Plus, Trash2, Pencil, X } from 'lucide-react'

function getUser() {
    const raw = localStorage.getItem('user') || sessionStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
}

const canManage = ['SERVICE_DESK', 'L1_SUPPORT', 'L2_SUPPORT', 'ADMIN']

function KnowledgeBase() {
    const user = getUser()
    const [articles, setArticles] = useState([])
    const [search, setSearch] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [category, setCategory] = useState('')
    const [error, setError] = useState('')
    const [viewing, setViewing] = useState(null)

    const load = () => {
        apiRequest('/knowledge-base').then(setArticles).catch(console.error)
    }

    useEffect(() => { load() }, [])

    const filtered = articles.filter((a) =>
        search === '' ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.content.toLowerCase().includes(search.toLowerCase())
    )

    const canEdit = (a) => user && (user.role === 'ADMIN' || a.author?.email === user.email)

    const resetForm = () => {
        setTitle(''); setContent(''); setCategory(''); setEditingId(null); setShowForm(false); setError('')
    }

    const startCreate = () => {
        resetForm()
        setShowForm(true)
    }

    const startEdit = (a) => {
        setTitle(a.title)
        setContent(a.content)
        setCategory(a.category || '')
        setEditingId(a.id)
        setShowForm(true)
        setViewing(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            if (editingId) {
                await apiRequest(`/knowledge-base/${editingId}`, {
                    method: 'PUT',
                    body: { title, content, category },
                })
            } else {
                await apiRequest('/knowledge-base', {
                    method: 'POST',
                    body: { title, content, category },
                })
            }
            resetForm()
            load()
        } catch (err) {
            setError(err.message)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this article?')) return
        try {
            await apiRequest(`/knowledge-base/${id}`, { method: 'DELETE' })
            setViewing(null)
            load()
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Knowledge Base</h1>
                    <p className="text-gray-500">Access help articles and tutorials</p>
                </div>
                {user && canManage.includes(user.role) && (
                    <button onClick={startCreate} className="flex items-center gap-2 bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-lg">
                        <Plus size={16} /> Create Article
                    </button>
                )}
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-purple-200 shadow-sm p-6 mb-6 space-y-4">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Article title"
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                    />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                    >
                        <option value="">No specific category</option>
                        <option value="NETWORK">Network</option>
                        <option value="EMAIL">Email</option>
                        <option value="HARDWARE">Hardware</option>
                        <option value="SOFTWARE">Software</option>
                        <option value="ACCESS_ACCOUNTS">Access & Accounts</option>
                        <option value="OTHER">Other</option>
                    </select>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Article content..."
                        rows={4}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                    />
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div className="flex gap-2">
                        <button type="submit" className="bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-lg">
                            {editingId ? 'Save Changes' : 'Publish Article'}
                        </button>
                        <button type="button" onClick={resetForm} className="text-gray-500 text-sm font-medium px-4 py-2 rounded-lg">
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-3 mb-6">
                <Search size={18} className="text-gray-400" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search articles..."
                    className="flex-1 text-sm outline-none"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map((a) => (
                    <div key={a.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg h-fit">
                            <FileText className="text-purple-600" size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                                <button
                                    onClick={() => setViewing(a)}
                                    className="font-semibold text-gray-900 text-sm text-left hover:text-purple-600"
                                >
                                    {a.title}
                                </button>
                                {canEdit(a) && (
                                    <div className="flex gap-2 shrink-0">
                                        <button onClick={() => startEdit(a)} className="text-gray-400 hover:text-purple-600">
                                            <Pencil size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(a.id)} className="text-gray-400 hover:text-red-600">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {a.content.length > 150 ? a.content.slice(0, 150) + '…' : a.content}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">By {a.author?.fullName} · {new Date(a.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && <p className="text-gray-400 text-sm col-span-2 text-center py-8">No articles yet.</p>}
            </div>

            {viewing && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setViewing(null)}>
                    <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-3">
                            <h2 className="text-lg font-bold text-gray-900 pr-4">{viewing.title}</h2>
                            <button onClick={() => setViewing(null)} className="text-gray-400 hover:text-gray-700">
                                <X size={18} />
                            </button>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{viewing.content}</p>
                        <p className="text-xs text-gray-400 mt-4">By {viewing.author?.fullName} · {new Date(viewing.createdAt).toLocaleDateString()}</p>
                        {canEdit(viewing) && (
                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                <button onClick={() => startEdit(viewing)} className="flex items-center gap-1 text-sm text-purple-600 font-medium">
                                    <Pencil size={14} /> Edit
                                </button>
                                <button onClick={() => handleDelete(viewing.id)} className="flex items-center gap-1 text-sm text-red-600 font-medium">
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default KnowledgeBase
