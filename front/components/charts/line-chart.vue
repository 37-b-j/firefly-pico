<template>
  <div class="line-chart">
    <svg :viewBox="`0 0 ${svgW} ${svgH}`" preserveAspectRatio="xMidYMid meet" class="line-chart-svg">
      <g v-for="(yVal, i) in gridYValues" :key="'grid-' + i">
        <line
          :x1="padL" :y1="gridYPositions[i]" :x2="padL + plotW" :y2="gridYPositions[i]"
          stroke="var(--van-border-color)" stroke-width="0.5"
        />
        <text
          :x="padL - 6" :y="gridYPositions[i] + 4"
          text-anchor="end" class="y-label"
        >{{ yVal }}</text>
      </g>

      <line
        v-if="baselineY !== null"
        :x1="padL" :y1="baselineY" :x2="padL + plotW" :y2="baselineY"
        stroke="var(--van-text-color-weak)" stroke-width="1" stroke-dasharray="4,3"
      />

      <path v-if="areaD" :d="areaD" fill="var(--van-primary-color)" fill-opacity="0.12" />

      <path v-if="lineD" :d="lineD" fill="none" stroke="var(--van-primary-color)"
            stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

      <circle v-if="lastPt" :cx="lastPt.x" :cy="lastPt.y" r="4.5"
              fill="var(--van-primary-color)" class="data-point" />

      <text v-if="minAnnotation" :x="minAnnotation.x" :y="minAnnotation.y"
            text-anchor="middle" class="annotation-label">{{ minAnnotation.label }}</text>
      <text v-if="maxAnnotation" :x="maxAnnotation.x" :y="maxAnnotation.y"
            text-anchor="middle" class="annotation-label">{{ maxAnnotation.label }}</text>
    </svg>

    <div class="x-labels-outer">
      <div class="x-labels">
        <span v-for="(item, i) in xLabelItems" :key="i"
            class="x-label" :class="{ hidden: !item.visible }"
            :style="{ left: item.pct + '%' }">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()

const props = defineProps({
  data: { type: Array, required: true },
})

const padL = 48, padR = 10, padT = 8, padB = 18
const svgW = 400, svgH = 170
const plotW = svgW - padL - padR
const plotH = svgH - padT - padB
const numGridLines = 3

const values = computed(() => props.data.map((d) => d.value))
const minV = computed(() => Math.min(0, ...values.value))
const maxV = computed(() => Math.max(...values.value, 1))
const range = computed(() => maxV.value - minV.value || 1)

const toX = (i) => padL + (i / Math.max(props.data.length - 1, 1)) * plotW
const toY = (v) => padT + plotH - ((v - minV.value) / range.value) * plotH

const pts = computed(() =>
  props.data.map((d, i) => ({ x: toX(i), y: toY(d.value), value: d.value, date: d.date }))
)

const lineD = computed(() =>
  pts.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
)

const areaD = computed(() => {
  if (pts.value.length < 2) return ''
  const first = pts.value[0]
  const last = pts.value[pts.value.length - 1]
  const baseY = padT + plotH
  return `${lineD.value} L ${last.x} ${baseY} L ${first.x} ${baseY} Z`
})

const lastPt = computed(() =>
  pts.value.length > 0 ? pts.value[pts.value.length - 1] : null
)

const baselineY = computed(() => {
  if (pts.value.length === 0) return null
  return pts.value[0].y
})

const gridYValues = computed(() =>
  Array.from({ length: numGridLines + 1 }, (_, i) => {
    const val = minV.value + (range.value / numGridLines) * i
    return formatNumber(val)
  })
)

const gridYPositions = computed(() =>
  Array.from({ length: numGridLines + 1 }, (_, i) =>
    padT + (plotH / numGridLines) * (numGridLines - i)
  )
)

function formatNumber(value) {
  const absVal = Math.abs(value)
  if (absVal >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (absVal >= 10000) return `${(value / 1000).toFixed(0)}k`
  if (absVal >= 1000) return `${(value / 1000).toFixed(1)}k`
  return value % 1 === 0 ? value.toString() : value.toFixed(1)
}

const minAnnotation = computed(() => {
  if (pts.value.length === 0) return null
  const pt = pts.value.reduce((a, b) => (a.value < b.value ? a : b))
  const offsetY = pt.y < padT + plotH / 2 ? 14 : -6
  return { x: pt.x, y: pt.y + offsetY, label: formatNumber(pt.value) }
})

const maxAnnotation = computed(() => {
  if (pts.value.length === 0) return null
  const pt = pts.value.reduce((a, b) => (a.value > b.value ? a : b))
  const offsetY = pt.y < padT + plotH / 2 ? 14 : -6
  return { x: pt.x, y: pt.y + offsetY, label: formatNumber(pt.value) }
})

const maxLabelCount = 7

const xLabelItems = computed(() => {
  const len = props.data.length
  if (len === 0) return []

  const step = len <= maxLabelCount ? 1 : Math.ceil(len / maxLabelCount)

  return props.data.map((d, i) => {
    const show = i % step === 0 || i === 0 || i === len - 1
    const svgX = padL + (len > 1 ? (i / (len - 1)) * plotW : plotW / 2)
    const pct = (svgX / svgW) * 100

    let label
    if (d.date === 'today') {
      label = t('today')
    } else {
      const parts = d.date.split('-')
      label = parts.length >= 2 ? `${parseInt(parts[1])}.${parts[0].slice(2)}` : d.date
    }

    return { label, visible: show, pct }
  })
})
</script>

<style scoped>
.line-chart { width: 100%; }
.line-chart-svg { width: 100%; height: auto; display: block; }
.data-point { filter: drop-shadow(0 0 3px var(--van-primary-color)); }
.y-label { font-size: 9px; fill: var(--van-text-color-weak); }
.annotation-label { font-size: 10px; font-weight: 600; fill: var(--van-text-color); }
.x-labels-outer {
  padding: 0 15px;
}
.x-labels {
  position: relative;
  height: 16px;
  margin-top: 2px;
}
.x-label {
  position: absolute;
  transform: translateX(-50%);
  font-size: 9px;
  color: var(--van-text-color-weak);
  white-space: nowrap;
}
.x-label.hidden {
  opacity: 0;
}
</style>