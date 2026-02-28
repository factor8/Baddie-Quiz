export async function onRequestGet(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const quizId = url.searchParams.get('quizId')
  const cursor = url.searchParams.get('cursor') || undefined
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100)

  try {
    const prefix = quizId ? `response:${quizId}:` : 'response:'
    const list = await env.RESULTS.list({ prefix, limit, cursor })

    const responses = await Promise.all(
      list.keys.map(async (key) => {
        const raw = await env.RESULTS.get(key.name)
        return { key: key.name, ...(raw ? JSON.parse(raw) : {}) }
      })
    )

    return Response.json({
      responses,
      cursor: list.list_complete ? null : list.cursor,
      hasMore: !list.list_complete,
    })
  } catch {
    return Response.json({ error: 'Failed to fetch responses' }, { status: 500 })
  }
}
