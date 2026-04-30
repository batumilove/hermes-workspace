import path from 'node:path'
import { describe, expect, it } from 'vitest'

describe('preview-file response headers', () => {
  it('sandboxes active preview content so it cannot run same-origin workspace API calls', async () => {
    const { buildPreviewHeaders } = await import('./preview-file')

    const headers = buildPreviewHeaders(path.join('/tmp', 'dispatch-demo', 'index.html'))

    expect(headers['Content-Type']).toBe('text/html; charset=utf-8')
    expect(headers['Content-Security-Policy']).toContain("default-src 'none'")
    expect(headers['Content-Security-Policy']).toContain('sandbox')
    expect(headers['Content-Security-Policy']).not.toContain('allow-same-origin')
    expect(headers['X-Content-Type-Options']).toBe('nosniff')
  })
})
