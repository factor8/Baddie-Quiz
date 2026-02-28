const BASE = '/api/dev/quizzes'

export function useQuizApi() {
  const listQuizzes = async () => {
    const res = await fetch(BASE)
    return res.json()
  }

  const getQuiz = async (id) => {
    const res = await fetch(`${BASE}/${encodeURIComponent(id)}`)
    return res.json()
  }

  const saveQuiz = async (quiz) => {
    const res = await fetch(`${BASE}/${encodeURIComponent(quiz.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quiz),
    })
    return res.json()
  }

  const createQuiz = async (quiz) => {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quiz),
    })
    return res.json()
  }

  const deleteQuiz = async (id) => {
    await fetch(`${BASE}/${encodeURIComponent(id)}`, { method: 'DELETE' })
  }

  return { listQuizzes, getQuiz, saveQuiz, createQuiz, deleteQuiz }
}
