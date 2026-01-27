'use client'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    label: string
  }
  accent?: boolean
}

export function StatCard({ title, value, subtitle, trend, accent = false }: StatCardProps) {
  return (
    <div className={`kith-card p-6 ${accent ? 'border-[var(--color-border-hover)]' : ''}`}>
      <h3 className="kith-label">{title}</h3>
      <p className={`mt-3 text-3xl font-semibold ${accent ? 'text-[#5B9A8B]' : 'text-[var(--color-text-primary)]'}`}>
        {value}
      </p>
      {subtitle && (
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{subtitle}</p>
      )}
      {trend && (
        <p className={`mt-2 text-sm ${trend.value >= 0 ? 'text-[#5B9A8B]' : 'text-red-400'}`}>
          {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
        </p>
      )}
    </div>
  )
}
