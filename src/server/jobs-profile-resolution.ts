import { getActiveProfileName } from './profiles-browser'

export function sanitizeProfileName(
  name: string | null | undefined,
): string | null {
  if (!name) return null
  const trimmed = String(name).trim()
  if (!trimmed) return null
  if (
    trimmed.includes('/') ||
    trimmed.includes('\\') ||
    trimmed.includes('..')
  ) {
    return null
  }
  return trimmed
}

export function resolveJobsProfile(
  url: URL,
  envProfile: string | null | undefined = process.env.HERMES_PROFILE,
  activeProfileResolver: () => string = getActiveProfileName,
): string | null {
  const fromQuery = sanitizeProfileName(url.searchParams.get('profile'))
  if (fromQuery) return fromQuery

  const fromEnv = sanitizeProfileName(envProfile)
  if (fromEnv) return fromEnv

  try {
    const fromFile = sanitizeProfileName(activeProfileResolver())
    if (fromFile && fromFile !== 'default') return fromFile
  } catch {
    // ignore file-backed profile lookup failures
  }

  return null
}

export function buildJobsProfileSearch(
  urlOrSearch: URL | string,
  profile: string | null,
): string {
  const sourceSearch =
    typeof urlOrSearch === 'string' ? urlOrSearch : urlOrSearch.search
  const params = new URLSearchParams(
    sourceSearch.startsWith('?') ? sourceSearch.slice(1) : sourceSearch,
  )

  params.delete('profile')
  if (profile) params.set('profile', profile)

  const query = params.toString()
  return query ? `?${query}` : ''
}
