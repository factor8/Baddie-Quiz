const BASE = '/api/backend'

export default function useBackendApi() {
  const fetchAllStats = async () => {
    const res = await fetch(`${BASE}/stats`, { cache: 'no-store' })
    return res.json()
  }

  const fetchResponses = async ({ quizId, cursor, limit = 50 } = {}) => {
    const params = new URLSearchParams()
    if (quizId) params.set('quizId', quizId)
    if (cursor) params.set('cursor', cursor)
    if (limit) params.set('limit', String(limit))
    const res = await fetch(`${BASE}/responses?${params}`, { cache: 'no-store' })
    return res.json()
  }

  const deleteResponse = async (key) => {
    const res = await fetch(`${BASE}/responses/${encodeURIComponent(key)}`, { method: 'DELETE' })
    return res.json()
  }

  return { fetchAllStats, fetchResponses, deleteResponse }
}
