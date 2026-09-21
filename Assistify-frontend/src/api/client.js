const BASE_URL = 'http://localhost:8080/api'

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