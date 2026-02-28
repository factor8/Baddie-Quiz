import fs from 'node:fs'
import path from 'node:path'

const QUIZZES_DIR = path.resolve('src/data/quizzes')

function getQuizFiles() {
  return fs.readdirSync(QUIZZES_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const content = fs.readFileSync(path.join(QUIZZES_DIR, f), 'utf-8')
      return { filename: f, data: JSON.parse(content) }
    })
}

function findQuizFile(id) {
  return getQuizFiles().find(f => f.data.id === id)
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', chunk => { data += chunk })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

export default function quizApiPlugin() {
  return {
    name: 'quiz-dev-api',
    configureServer(server) {
      // Backend dashboard API stubs (KV not available in vite dev)
      server.middlewares.use((req, res, next) => {
        if (!req.url.startsWith('/api/backend')) return next()
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Cache-Control', 'no-store')

        if (req.url.startsWith('/api/backend/stats')) {
          res.end(JSON.stringify([]))
        } else if (req.url.startsWith('/api/backend/responses') && req.method === 'DELETE') {
          res.end(JSON.stringify({ ok: true }))
        } else if (req.url.startsWith('/api/backend/responses')) {
          res.end(JSON.stringify({ responses: [], cursor: null, hasMore: false }))
        } else {
          next()
        }
      })

      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/dev/quizzes')) return next()

        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Cache-Control', 'no-store')

        const urlPath = req.url.split('?')[0]
        const quizId = urlPath.replace('/api/dev/quizzes', '').replace(/^\//, '') || null

        try {
          if (req.method === 'GET' && !quizId) {
            const quizzes = getQuizFiles().map(f => f.data)
            res.end(JSON.stringify(quizzes))
          }
          else if (req.method === 'GET' && quizId) {
            const found = findQuizFile(decodeURIComponent(quizId))
            if (!found) { res.statusCode = 404; res.end('{"error":"not found"}'); return }
            res.end(JSON.stringify(found.data))
          }
          else if (req.method === 'PUT' && quizId) {
            const body = await readBody(req)
            const quiz = JSON.parse(body)
            const found = findQuizFile(decodeURIComponent(quizId))
            const filename = found ? found.filename : `${quizId}.json`
            fs.writeFileSync(path.join(QUIZZES_DIR, filename), JSON.stringify(quiz, null, 2) + '\n')
            res.end(JSON.stringify(quiz))
          }
          else if (req.method === 'POST' && !quizId) {
            const body = await readBody(req)
            const quiz = JSON.parse(body)
            const filename = `${quiz.id}.json`
            fs.writeFileSync(path.join(QUIZZES_DIR, filename), JSON.stringify(quiz, null, 2) + '\n')
            res.statusCode = 201
            res.end(JSON.stringify(quiz))
          }
          else if (req.method === 'DELETE' && quizId) {
            const found = findQuizFile(decodeURIComponent(quizId))
            if (!found) { res.statusCode = 404; res.end('{"error":"not found"}'); return }
            fs.unlinkSync(path.join(QUIZZES_DIR, found.filename))
            res.end('{"ok":true}')
          }
          else {
            next()
          }
        } catch (err) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: err.message }))
        }
      })
    }
  }
}
