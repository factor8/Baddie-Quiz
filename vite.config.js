import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import quizApiPlugin from './src/dev/quiz-api-plugin.js'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    quizApiPlugin(),
  ],
})
