<template>
  <van-cell-group inset>
    <div class="van-cell-group-title">{{ $t('dashboard.net_worth.title') }}:</div>

    <div class="flex-center flex-column my-2">
      <span class="text-size-22 font-700">
        {{ formatNumberForDashboard(dashboardStore.netWorthCurrent) }}
        {{ dashboardStore.dashboardCurrencyCode }}
      </span>
      <span v-if="trendText" :class="trendClass" class="text-size-12 mt-1">
        {{ trendText }}
      </span>
    </div>

    <div v-if="!dashboardStore.isLoadingNetWorthHistory && chartHasData">
      <line-chart :data="dashboardStore.netWorthChartData" />
    </div>
    <div v-else-if="dashboardStore.isLoadingNetWorthHistory" class="flex-center py-5">
      <van-loading size="20" />
    </div>
    <div v-else class="flex-center py-3 text-muted text-size-12">
      {{ $t('general.list_empty') }}
    </div>
  </van-cell-group>
</template>

<script setup>
import LineChart from '~/components/charts/line-chart.vue'
import { formatNumberForDashboard } from '~/utils/NumberUtils.js'

const dashboardStore = useDashboardStore()

const chartHasData = computed(() =>
  (dashboardStore.netWorthChartData?.length ?? 0) > 1
)

const trendText = computed(() => {
  const p = dashboardStore.netWorthTrend
  if (p === null || p === undefined || isNaN(p)) return null
  const sign = p >= 0 ? '+' : ''
  return `${sign}${p.toFixed(1)}%`
})

const trendClass = computed(() =>
  (dashboardStore.netWorthTrend ?? 0) >= 0 ? 'text-success' : 'text-danger'
)
</script>