import React, { useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Circle, Defs, Mask, Path } from 'react-native-svg'

type Segment = { value: number; color: string }
type RingPath = { key: string; color: string; d: string }

type Props = {
  segments: Segment[]
  valueText: string
  unitText?: string

  size?: number
  thickness?: number
  gapDeg?: number
  backgroundColor?: string

  // animations
  drawDurationMs?: number
  slideDurationMs?: number
  slideFps?: number
}

const TAU = Math.PI * 2

function polar(cx: number, cy: number, r: number, a: number) {
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

function segmentPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  a0: number,
  a1: number,
  capRadius: number,
) {
  const p0o = polar(cx, cy, rOuter, a0)
  const p1o = polar(cx, cy, rOuter, a1)
  const p1i = polar(cx, cy, rInner, a1)
  const p0i = polar(cx, cy, rInner, a0)

  const sweep = a1 - a0
  const largeArc = sweep > Math.PI ? 1 : 0

  return [
    `M ${p0o.x} ${p0o.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p1o.x} ${p1o.y}`,
    `A ${capRadius} ${capRadius} 0 0 1 ${p1i.x} ${p1i.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${p0i.x} ${p0i.y}`,
    `A ${capRadius} ${capRadius} 0 0 1 ${p0o.x} ${p0o.y}`,
    'Z',
  ].join(' ')
}

function buildPaths(
  segments: Segment[],
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  capRadius: number,
  gapDeg: number,
): RingPath[] {
  const clean = segments.filter((s) => s.value > 0)
  const total = clean.reduce((sum, s) => sum + s.value, 0) || 1

  const gap = (gapDeg * Math.PI) / 180
  const start = -Math.PI / 2

  return clean.reduce(
    (res, seg, idx) => {
      const sweep = (seg.value / total) * TAU

      const segStart = start + res.acc
      const segEnd = segStart + sweep

      const a0 = segStart + gap / 2
      const a1 = segEnd - gap / 2

      if (a1 > a0) {
        res.items.push({
          key: String(idx),
          color: seg.color,
          d: segmentPath(cx, cy, rOuter, rInner, a0, a1, capRadius),
        })
      }

      return { acc: res.acc + sweep, items: res.items }
    },
    { acc: 0, items: [] as RingPath[] },
  ).items
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

export default function DonutChart({
  segments,
  valueText,
  unitText = 'Lots',
  size = 320,
  thickness = 44,
  gapDeg = 6,
  backgroundColor = '#F3F4F6',
  drawDurationMs = 900,
  slideDurationMs = 420,
  slideFps = 30,
}: Props) {
  const cx = size / 2
  const cy = size / 2

  const rOuter = size * 0.46
  const rInner = rOuter - thickness

  const capRadius = Math.max(thickness * 0.9, thickness / 2 + 1)

  const drawP = useSharedValue(0)
  const [hasDrawn, setHasDrawn] = useState(false)

  const rMask = (rOuter + rInner) / 2
  const circumference = TAU * rMask

  const maskAnimatedProps = useAnimatedProps(() => {
    const dashOffset = circumference * (1 - drawP.value)

    return { strokeDashoffset: dashOffset }
  })

  useEffect(() => {
    drawP.value = 0
    cancelAnimation(drawP)

    drawP.value = withTiming(
      1,
      { duration: drawDurationMs, easing: Easing.out(Easing.cubic) },
      (finished) => {
        if (finished) runOnJS(setHasDrawn)(true)
      },
    )
  }, [])

  // ====== SLIDE animation by interpolating values ======
  const [animSegments, setAnimSegments] = useState<Segment[]>(segments)

  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number>(0)
  const fromRef = useRef<Segment[]>(segments)
  const toRef = useRef<Segment[]>(segments)
  const currentRef = useRef<Segment[]>(segments)

  const dataSig = useMemo(
    () => JSON.stringify(segments.map((s) => [s.value, s.color])),
    [segments],
  )

  useEffect(() => {
    if (!hasDrawn) {
      setAnimSegments(segments)
      fromRef.current = segments
      toRef.current = segments
      currentRef.current = segments

      return
    }

    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    const from = currentRef.current
    const to = segments

    fromRef.current = from
    toRef.current = to
    startRef.current = Date.now()

    const frameInterval = 1000 / slideFps

    const tick = () => {
      const now = Date.now()
      const elapsed = now - startRef.current
      const tRaw = Math.min(1, elapsed / slideDurationMs)
      const t = easeOutCubic(tRaw)

      const next: Segment[] = toRef.current.map((segTo, i) => {
        const segFrom = fromRef.current[i] ?? { value: 0, color: segTo.color }
        const v = segFrom.value + (segTo.value - segFrom.value) * t

        return { value: v, color: segTo.color }
      })

      currentRef.current = next
      setAnimSegments(next)

      if (tRaw < 1) {
        rafRef.current = requestAnimationFrame(() => {
          const delay = frameInterval - (Date.now() - now)
          if (delay > 1) {
            setTimeout(() => {
              rafRef.current = requestAnimationFrame(tick)
            }, delay)
          } else {
            rafRef.current = requestAnimationFrame(tick)
          }
        })
      } else {
        currentRef.current = toRef.current
        setAnimSegments(toRef.current)
        rafRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [dataSig, hasDrawn, slideDurationMs, slideFps])

  const paths = useMemo(() => {
    return buildPaths(animSegments, cx, cy, rOuter, rInner, capRadius, gapDeg)
  }, [animSegments, cx, cy, rOuter, rInner, capRadius, gapDeg])

  const maskId = 'ringMask'

  return (
    <View style={[styles.wrap, { width: size, height: size, backgroundColor }]}>
      <Svg height={size} width={size}>
        <Defs>
          <Mask id={maskId}>
            <Circle cx={cx} cy={cy} fill='black' r={size} />
            <AnimatedCircle
              animatedProps={maskAnimatedProps}
              cx={cx}
              cy={cy}
              fill='none'
              originX={cx}
              originY={cy}
              r={rMask}
              rotation={-90}
              stroke='white'
              strokeDasharray={`${circumference} ${circumference}`}
              strokeLinecap='butt'
              strokeWidth={thickness + 2}
            />
          </Mask>
        </Defs>

        {paths.map((p) => (
          <Path key={p.key} d={p.d} fill={p.color} mask={`url(#${maskId})`} />
        ))}
      </Svg>

      <View pointerEvents='none' style={styles.center}>
        <Text style={styles.value}>{valueText}</Text>
        <Text style={styles.unit}>{unitText}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: { fontSize: 15, fontWeight: '800', color: '#111827', lineHeight: 18 },
  unit: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 14,
  },
})
