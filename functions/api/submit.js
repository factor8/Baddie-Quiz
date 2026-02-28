export async function onRequestPost(context) {
  const { request, env } = context

  try {
    const { quizId, verdict, score, answers } = await request.json()

    // Validate the verdict key
    const validKeys = ['green', 'yellow', 'orange', 'red']
    if (!validKeys.includes(verdict)) {
      return new Response(JSON.stringify({ error: 'Invalid verdict' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Namespace stats by quiz ID
    const kvKey = quizId ? `stats:${quizId}` : 'stats'

    // Get current stats from KV
    const raw = await env.RESULTS.get(kvKey)
    const stats = raw
      ? JSON.parse(raw)
      : { green: 0, yellow: 0, orange: 0, red: 0 }

    // Increment the count
    stats[verdict] += 1

    // Write back to KV
    await env.RESULTS.put(kvKey, JSON.stringify(stats))

    // Store individual response with full answer detail
    if (answers) {
      const ts = Date.now()
      const responseKey = `response:${quizId || 'default'}:${ts}`
      await env.RESULTS.put(responseKey, JSON.stringify({
        quizId,
        verdict,
        score,
        answers,
        submittedAt: new Date(ts).toISOString(),
      }))
    }

    return new Response(JSON.stringify(stats), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    return new Response(JSON.stringify({ error: 'Something went wrong' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
