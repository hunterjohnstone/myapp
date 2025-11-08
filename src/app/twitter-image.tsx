import { ImageResponse } from 'next/server'

export const runtime = 'edge'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default function TwitterImage() {
  const { width, height } = size

  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '96px',
          backgroundColor: '#0b0b0f',
          color: '#f5f5f7',
          fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 18,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(245, 245, 247, 0.6)',
            marginBottom: 24,
          }}
        >
          Hunter Johnstone
        </div>
        <div
          style={{
            fontSize: 68,
            fontWeight: 600,
            lineHeight: 1.08,
            maxWidth: 820,
            marginBottom: 28,
          }}
        >
          Build people-first software, fast.
        </div>
        <div
          style={{
            fontSize: 28,
            color: 'rgba(245, 245, 247, 0.76)',
            maxWidth: 720,
            marginBottom: 40,
          }}
        >
          Web & mobile apps, internal tools, and automations with measurable results.
        </div>
        <div
          style={{
            display: 'flex',
            gap: 16,
            fontSize: 20,
            color: '#0b0b0f',
          }}
        >
          <span style={{ padding: '10px 24px', borderRadius: 999, backgroundColor: '#f5f5f7', fontWeight: 600 }}>
            38% faster onboarding
          </span>
          <span style={{ padding: '10px 24px', borderRadius: 999, backgroundColor: 'rgba(245, 245, 247, 0.16)', color: 'rgba(245, 245, 247, 0.8)' }}>
            v1 in 5 weeks
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
