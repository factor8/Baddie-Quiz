export async function onRequestGet(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const quizId = url.searchParams.get('quizId')

  try {
    if (quizId) {
      const raw = await env.RESULTS.get(`stats:${quizId}`)
      const stats = raw ? JSON.parse(raw) : { green: 0, yellow: 0, orange: 0, red: 0 }
      return Response.json([{ quizId, stats }])
    }

    const list = await env.RESULTS.list({ prefix: 'stats:' })
    const all = await Promise.all(
      list.keys.map(async (key) => {
        const raw = await env.RESULTS.get(key.name)
        return {
          quizId: key.name.replace('stats:', ''),
          stats: raw ? JSON.parse(raw) : { green: 0, yellow: 0, orange: 0, red: 0 },
        }
      })
    )
    return Response.json(all)
  } catch {
    return Response.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
