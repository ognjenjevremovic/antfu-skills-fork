import { execFileSync } from 'node:child_process'
import { appendFileSync, writeFileSync } from 'node:fs'
import * as path from 'node:path'
import { cwd } from 'node:process'

function runGit(args: string[], cwd?: string): string {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim()
}

function tryGit(args: string[], cwd?: string): string | null {
  try {
    return runGit(args, cwd)
  }
  catch {
    return null
  }
}

const logFileName = 'submodule-branches.log'
const logFilePath = path.resolve(cwd(), logFileName)

writeFileSync(logFilePath, '')

const rawDisplayPaths = execFileSync(
  'git',
  [
    'submodule',
    'foreach',
    '--quiet',
    '--recursive',
    'printf "%s\\0" "$displaypath"',
  ],
  {
    encoding: 'buffer',
    stdio: ['ignore', 'pipe', 'inherit'],
  },
)

const displayPaths = rawDisplayPaths
  .toString('utf8')
  .split('\0')
  .filter(Boolean)

for (const displayPath of displayPaths) {
  if (
    !displayPath.startsWith('vendor/')
    && !displayPath.startsWith('sources/')
  ) {
    continue
  }

  const repoPath = path.resolve(cwd(), displayPath)

  const url = tryGit(['remote', 'get-url', 'origin'], repoPath) ?? 'no-origin'

  const branch
    = tryGit(['symbolic-ref', '--short', '-q', 'HEAD'], repoPath)
      ?? `DETACHED@${runGit(['rev-parse', '--short', 'HEAD'], repoPath)}`

  const line = `${path.posix.basename(displayPath)} (${url}): ${branch}`

  console.log(line)
  appendFileSync(logFilePath, `${line}\n`)
}
