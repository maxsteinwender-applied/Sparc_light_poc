import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const ROOT = process.cwd()
const DIRECTORIES = ['src', 'tests']
const FILE_EXTENSIONS = new Set(['.ts', '.vue', '.js', '.mjs', '.cjs'])

const checkers = [
  {
    name: 'Merge-Konfliktmarker',
    pattern: /^<{7}|^={7}|^>{7}/m,
  },
  {
    name: 'debugger',
    pattern: /\bdebugger\b/,
  },
  {
    name: 'console.log',
    pattern: /\bconsole\.log\s*\(/,
  },
]

const files = []

const collectFiles = async (directory) => {
  const absoluteDirectory = path.join(ROOT, directory)
  let entries = []

  try {
    entries = await readdir(absoluteDirectory, { withFileTypes: true })
  } catch {
    return
  }

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.')) {
      continue
    }

    const absolutePath = path.join(absoluteDirectory, entry.name)
    const relativePath = path.relative(ROOT, absolutePath)

    if (entry.isDirectory()) {
      await collectFiles(relativePath)
      continue
    }

    if (!FILE_EXTENSIONS.has(path.extname(entry.name))) {
      continue
    }

    files.push(relativePath)
  }
}

for (const directory of DIRECTORIES) {
  await collectFiles(directory)
}

const violations = []

for (const file of files) {
  const absolutePath = path.join(ROOT, file)
  const content = await readFile(absolutePath, 'utf8')

  for (const checker of checkers) {
    if (checker.pattern.test(content)) {
      violations.push(`${file}: ${checker.name}`)
    }
  }
}

if (violations.length > 0) {
  console.error('Lint-Fehler gefunden:')
  for (const violation of violations) {
    console.error(`- ${violation}`)
  }
  process.exit(1)
}

console.log(`Lint erfolgreich (${files.length} Dateien geprüft).`)
