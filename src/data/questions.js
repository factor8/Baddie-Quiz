// Shared quiz utilities — quiz data lives in src/data/quizzes/

export function getVerdict(score, verdicts) {
  return verdicts.find((v) => score >= v.min && score <= v.max) || verdicts[verdicts.length - 1]
}

// Map slider value (0-10) to score range
// Not scared (0) = good = +maxScore, Terrified (10) = fumbling = -maxScore
export function sliderToScore(value, maxScore = 5) {
  return Math.round(maxScore - value * maxScore / 5)
}
