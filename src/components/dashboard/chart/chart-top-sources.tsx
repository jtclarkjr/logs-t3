'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { ChartTooltip } from '@/components/ui/chart'
import { EmptyState } from '@/components/ui/empty-state'
import { QueryError } from '@/components/ui/error-boundary'
import { LoadingState } from '@/components/ui/loading-state'
import type { RouterOutputs } from '@/trpc/react'

interface TopSourcesChartProps {
  aggregationData?: RouterOutputs['logs']['getAggregation']
  isLoading: boolean
  error?: unknown
}

function TopSourcesChartContent({
  isLoading,
  error,
  aggregationData
}: TopSourcesChartProps) {
  if (isLoading) {
    return <LoadingState variant="chart" />
  }
  if (error) {
    return <QueryError error={error} title="Failed to load source data" />
  }
  if (!aggregationData?.bySource.length) {
    return (
      <EmptyState
        description="No logs found for the selected filters"
        title="No source data available"
      />
    )
  }
  return (
    <ResponsiveContainer height={320} width="100%">
      <BarChart data={aggregationData.bySource.slice(0, 10)}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis angle={-45} dataKey="source" height={80} textAnchor="end" />
        <YAxis />
        <ChartTooltip />
        <Bar dataKey="count" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function TopSourcesChart({
  aggregationData,
  isLoading,
  error
}: TopSourcesChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Log Sources</CardTitle>
        <CardDescription>
          Most active log sources in the selected time period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TopSourcesChartContent
          aggregationData={aggregationData}
          error={error}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  )
}
