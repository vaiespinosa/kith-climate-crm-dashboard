'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface SegmentChartProps {
  data: {
    name: string
    value: number
    color: string
  }[]
  title: string
}

export function SegmentChart({ data, title }: SegmentChartProps) {
  return (
    <div className="kith-card p-6">
      <h3 className="kith-label mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
              labelLine={{ stroke: 'rgba(232, 230, 227, 0.25)' }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#232629',
                border: '1px solid rgba(232, 230, 227, 0.06)',
                borderRadius: '6px',
                color: '#e8e6e3'
              }}
            />
            <Legend
              wrapperStyle={{ color: 'rgba(232, 230, 227, 0.5)' }}
              formatter={(value) => <span style={{ color: 'rgba(232, 230, 227, 0.5)' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
