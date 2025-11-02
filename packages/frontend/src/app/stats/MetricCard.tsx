import { Card } from '@/components/ui/card'

interface MetricCardProps {
  icon: string
  title: string
  value: string | number
  subtitle: string
  highlight?: string
  colorClass?: string
}

export function MetricCard({
  icon,
  title,
  value,
  subtitle,
  highlight,
  colorClass = 'text-blue-600'
}: MetricCardProps) {
  return (
    <Card className="p-6 bg-white shadow-sm rounded-2xl border-0 hover:shadow-md transition-shadow duration-200">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-base font-medium text-gray-700">{title}</h3>
        </div>

        <div className={`text-5xl font-bold ${colorClass}`}>
          {value}
        </div>

        <div className="text-sm text-gray-500">{subtitle}</div>

        {highlight && (
          <div className="text-sm font-medium text-gray-600 bg-gray-100 rounded-full px-3 py-1 inline-block">
            {highlight}
          </div>
        )}
      </div>
    </Card>
  )
}
