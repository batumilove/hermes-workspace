import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const repoRoot = process.cwd()

function read(path: string): string {
  return readFileSync(join(repoRoot, path), 'utf8')
}

function workflowFiles(): Array<{ path: string; content: string }> {
  return readdirSync(join(repoRoot, '.github', 'workflows'))
    .filter((name) => /\.ya?ml$/.test(name))
    .map((name) => ({
      path: `.github/workflows/${name}`,
      content: read(`.github/workflows/${name}`),
    }))
}

function trackedTextFiles(): Array<{ path: string; content: string }> {
  const candidates = [
    'README.md',
    'CHANGELOG.md',
    'install.sh',
    'vite.config.ts',
    'src/server/hermes-agent.ts',
    'docs/AGENT-PAIRING.md',
  ]

  return candidates.map((path) => ({ path, content: read(path) }))
}

describe('supply-chain hardening', () => {
  it('uses deterministic pnpm installs in workflows', () => {
    const offenders = workflowFiles().flatMap(({ path, content }) =>
      content
        .split('\n')
        .map((line, index) => ({ line, index: index + 1 }))
        .filter(
          ({ line }) =>
            /pnpm\s+install/.test(line) && !/--frozen-lockfile/.test(line),
        )
        .map(({ line, index }) => `${path}:${index}: ${line.trim()}`),
    )

    expect(offenders).toEqual([])
  })

  it('keeps dependency install scripts disabled by default', () => {
    const npmrc = read('.npmrc')

    expect(npmrc).toMatch(/^ignore-scripts\s*=\s*true$/m)
  })

  it('enforces an npm registry age cooldown for new package versions', () => {
    const npmrc = read('.npmrc')

    expect(npmrc).toMatch(/^minimum-release-age\s*=\s*10080$/m)
  })

  it('does not keep curl-pipe-shell installer instructions in tracked docs or runtime messages', () => {
    const offenders = trackedTextFiles().flatMap(({ path, content }) =>
      content
        .split('\n')
        .map((line, index) => ({ line, index: index + 1 }))
        .filter(({ line }) => /curl\b[^\n|]*\|\s*(?:bash|sh)\b/.test(line))
        .map(({ line, index }) => `${path}:${index}: ${line.trim()}`),
    )

    expect(offenders).toEqual([])
  })

  it('pins GitHub Actions by immutable commit SHA', () => {
    const offenders = workflowFiles().flatMap(({ path, content }) =>
      content
        .split('\n')
        .map((line, index) => ({ line, index: index + 1 }))
        .filter(({ line }) => /^\s*uses:\s*[^\s]+@/.test(line))
        .filter(({ line }) => !/@[0-9a-f]{40}(?:\s|$)/i.test(line))
        .map(({ line, index }) => `${path}:${index}: ${line.trim()}`),
    )

    expect(offenders).toEqual([])
  })
})
