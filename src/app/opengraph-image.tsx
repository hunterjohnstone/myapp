import { ImageResponse } from 'next/server'

export const runtime = 'edge'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default function OpenGraphImage() {
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
          backgroundColor: '#f5f5f7',
          color: '#0b0b0f',
          fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 18,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(12, 12, 16, 0.6)',
            marginBottom: 24,
          }}
        >
          Hunter Johnstone
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 600,
            lineHeight: 1.05,
            maxWidth: 820,
            marginBottom: 28,
          }}
        >
          Build people-first software, fast.
        </div>
        <div
          style={{
            fontSize: 28,
            color: 'rgba(12, 12, 16, 0.72)',
            maxWidth: 720,
            marginBottom: 40,
          }}
        >
          Software engineer & product consultant for early-stage founders and product teams.
        </div>
        <div
          style={{
            display: 'flex',
            gap: 16,
            fontSize: 20,
            color: 'rgba(12, 12, 16, 0.75)',
          }}
        >
          <span style={{ padding: '10px 24px', borderRadius: 999, backgroundColor: '#0b0b0f', color: '#f5f5f7' }}>
            Web & mobile apps
          </span>
          <span style={{ padding: '10px 24px', borderRadius: 999, backgroundColor: 'rgba(12, 12, 16, 0.08)' }}>
            Internal tools
          </span>
          <span style={{ padding: '10px 24px', borderRadius: 999, backgroundColor: 'rgba(12, 12, 16, 0.08)' }}>
            Automations
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
