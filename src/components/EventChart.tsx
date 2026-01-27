'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface EventChartProps {
  data: {
    event: string
    registered: number
    attended: number
  }[]
}

export function EventChart({ data }: EventChartProps) {
  return (
    <div className="kith-card p-6">
      <h3 className="kith-label mb-4">Workshop Attendance</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(232, 230, 227, 0.06)" />
            <XAxis
              dataKey="event"
              tick={{ fill: 'rgba(232, 230, 227, 0.5)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(232, 230, 227, 0.06)' }}
            />
            <YAxis
              tick={{ fill: 'rgba(232, 230, 227, 0.5)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(232, 230, 227, 0.06)' }}
            />
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
            <Bar dataKey="registered" fill="rgba(91, 154, 139, 0.4)" name="Registered" radius={[4, 4, 0, 0]} />
            <Bar dataKey="attended" fill="#5B9A8B" name="Attended" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
