const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')
const BASE_URL = `${API_ORIGIN}/api`

export async function apiRequest(path, { method = 'GET', body, auth = true } = {}) {
    const headers = { 'Content-Type': 'application/json' }
    if (auth) {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token')
        if (token) headers.Authorization = `Bearer ${token}`
    }

    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
        throw new Error(data?.error || 'Something went wrong')
    }

    return data
}

export async function downloadAttachment(requestId, attachmentId, fileName) {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/requests/${requestId}/attachments/${attachmentId}/download`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (!res.ok) throw new Error('Failed to download attachment')

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
}