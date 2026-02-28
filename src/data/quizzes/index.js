import fumblingABaddie from './fumbling-a-baddie.json'
import fumblingABaddieV2 from './fumbling-a-baddie-v2.json'
import fumblingABaddieV3 from './fumbling-a-baddie-v3.json'

// Add new quizzes here — they'll automatically appear in the dev quiz picker
const quizzes = [
  fumblingABaddieV3,
  fumblingABaddieV2,
  fumblingABaddie,
]

export default quizzes

export function getQuizById(id) {
  return quizzes.find((q) => q.id === id)
}
