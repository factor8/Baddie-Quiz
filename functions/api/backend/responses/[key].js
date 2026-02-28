export async function onRequestDelete(context) {
  const { params, env } = context
  const key = decodeURIComponent(params.key)

  try {
    const raw = await env.RESULTS.get(key)
    if (raw) {
      const response = JSON.parse(raw)
      const statsKey = `stats:${response.quizId || 'default'}`
      const statsRaw = await env.RESULTS.get(statsKey)
      if (statsRaw) {
        const stats = JSON.parse(statsRaw)
        if (stats[response.verdict] > 0) {
          stats[response.verdict] -= 1
          await env.RESULTS.put(statsKey, JSON.stringify(stats))
        }
      }
    }
    await env.RESULTS.delete(key)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
