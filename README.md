# Are You About to Fumble This Baddie?

A dramatically unhinged quiz platform that tells people what they already know but refuse to accept.

Persian carpet meets modern baddie energy. Serif fonts doing heavy lifting. Orange and teal arguing beautifully.

## The Stack

| Layer | Tech | Why |
|-------|------|-----|
| Frontend | React + Vite | Fast, simple, no nonsense |
| Styling | Tailwind CSS | Persian carpet patterns via pure CSS gradients |
| Animations | Framer Motion | Dramatic entrances deserve dramatic code |
| Hosting | Cloudflare Pages | Free tier. The whole thing lives here |
| Storage | Cloudflare KV | Four counters. That's it. That's the database |
| API | Cloudflare Pages Functions | One function. Increments numbers. Gets paid nothing |

## Getting Started

```bash
npm install
npm run dev
```

That's it. Open `localhost:5173`. Click through the quiz. Question your life choices.

## Dev Controls

In dev mode you get a toolbar at the bottom right:

- **Home** -- back to landing
- **Quiz** -- jump to quiz
- **Result+** -- see the green verdict (score 25)
- **Result-** -- see the red verdict (score -5)
- **Quiz Picker** -- dropdown to switch between quizzes
- **Prev / Next** -- navigate questions without answering (inside quiz)

These controls are stripped from production builds. `import.meta.env.DEV` does the work.

## Creating a New Quiz

**Step 1.** Create a file in `src/data/quizzes/`:

```js
// src/data/quizzes/my-new-quiz.js
export default {
  id: 'my-new-quiz',              // URL-safe identifier
  title: 'The Quiz Title',         // Landing page heading
  subtitle: 'The hook line.',      // Landing page body text
  tagline: 'The italic kicker.',   // Appears below subtitle in orange italic
  cta: 'Start This Thing',         // Button text
  shareTitle: 'The Quiz Title',    // Used in share text

  questions: [
    // SLIDER question (0-10, maps to +5 to -5 score)
    {
      id: 1,
      text: "Your question here?",
      type: "slider",
      min: 0,
      max: 10,
      labels: { low: "Left label", high: "Right label" },
    },

    // CHOICE question (each option has a score)
    {
      id: 2,
      text: "Pick one:",
      type: "choice",
      options: [
        { text: "Good answer", score: 5 },
        { text: "Mid answer", score: 0 },
        { text: "Bad answer", score: -5 },
        { text: "Catastrophic answer", score: -10 },
      ],
    },
  ],

  verdicts: [
    {
      key: "green",           // Used for KV storage
      emoji: "\ud83d\udfe2",  // The big emoji on results
      min: 20,                // Score range (inclusive)
      max: 30,
      title: "You Passed",
      description: "The verdict description. Make it hit.",
      color: "teal",          // teal | orange | red
    },
    {
      key: "yellow",
      emoji: "\ud83d\udfe1",
      min: 10,
      max: 19,
      title: "Ehhh",
      description: "Not great, not terrible.",
      color: "orange",
    },
    {
      key: "orange",
      emoji: "\ud83d\udfe0",
      min: 0,
      max: 9,
      title: "Yikes",
      description: "You know what you did.",
      color: "orange",
    },
    {
      key: "red",
      emoji: "\ud83d\udd34",
      min: -Infinity,
      max: -1,
      title: "It's Over",
      description: "Pack it up.",
      color: "red",
    },
  ],
}
```

**Step 2.** Register it in `src/data/quizzes/index.js`:

```js
import fumblingABaddie from './fumbling-a-baddie'
import myNewQuiz from './my-new-quiz'

const quizzes = [
  fumblingABaddie,
  myNewQuiz,
]
```

**Step 3.** Run `npm run dev`. Your quiz appears in the dev dropdown. Done.

### Quiz Anatomy

- **Questions** can be `slider` (0-10 range) or `choice` (multiple options with individual scores)
- **Scores** are additive -- every answer adds or subtracts from a running total
- **Verdicts** match the final score to a range. Four tiers: green, yellow, orange, red
- **Verdict colors** map to pre-built CSS themes: `teal` (positive), `orange` (mid), `red` (bad)
- **KV stats** are namespaced per quiz automatically (`stats:{quizId}`)

### Scoring Tips

- Positive scores = not fumbling. Negative = fumbling
- The best answer per question should be +5 to +10
- The worst should be -5 to -10
- Leave room for "mid" answers (-2 to +3) -- they're the most revealing
- Slider always maps 0-10 to +5 to -5 (low value = good, high value = bad)
- Your verdict ranges should cover the full possible score range with no gaps

## Deploying

```bash
npm run build

# First time: create the project + KV namespace
npx wrangler pages project create are-you-fumbling-a-baddie
npx wrangler kv namespace create RESULTS
# Paste the namespace ID into wrangler.toml

# Deploy
npx wrangler pages deploy dist
```

The site runs on the free `.pages.dev` subdomain. Custom domains are optional.

## Project Structure

```
src/
  App.jsx                    -- Screen router + dev controls
  main.jsx                   -- React entry
  index.css                  -- Tailwind + Persian carpet CSS
  data/
    questions.js             -- Shared utilities (getVerdict, sliderToScore)
    quizzes/
      index.js               -- Quiz registry
      fumbling-a-baddie.js   -- The original quiz
  components/
    Landing.jsx              -- Title screen
    Quiz.jsx                 -- Question flow + progress bar
    Question.jsx             -- Slider + choice rendering
    Results.jsx              -- Verdict reveal + share + stats
functions/
  api/
    submit.js                -- Cloudflare Worker: KV counter
```

## License

Do whatever you want with this. But if you fumble a baddie that's on you.
