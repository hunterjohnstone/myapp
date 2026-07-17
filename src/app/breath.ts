// Shared breathing signal. HeroOrbit's frame loop drives the envelope;
// BinaryPortrait reads it so the digit stream breathes with the portrait
// instead of running a second, unrelated clock.

export const breathState = {
  value: 0, // raw envelope 0..1
  strength: 1, // per-cycle intensity variation
}

function smoothstep01(x: number) {
  const clamped = Math.max(0, Math.min(1, x))
  return clamped * clamped * (3 - 2 * clamped)
}

// Natural calm breathing is asymmetric: inhale (~35% of the cycle), a tiny
// pause (~8%), then a longer exhale (~57%). The long exhale is what makes it
// read as calm rather than mechanical.
export function breathEnvelope(progress: number) {
  if (progress < 0.35) return smoothstep01(progress / 0.35)
  if (progress < 0.43) return 1
  return 1 - smoothstep01((progress - 0.43) / 0.57)
}
