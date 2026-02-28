// Shared quiz utilities — quiz data lives in src/data/quizzes/

export function getVerdict(score, verdicts) {
  return verdicts.find((v) => score >= v.min && score <= v.max) || verdicts[verdicts.length - 1]
}

// Map slider value (0-10) to score (+5 to -5)
// Not scared (0) = good = +5, Terrified (10) = fumbling = -5
export function sliderToScore(value) {
  return 5 - value
}
