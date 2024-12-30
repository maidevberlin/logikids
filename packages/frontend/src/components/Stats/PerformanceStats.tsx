import { Text } from '../base/Typography/Text'
import { ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts'

const GaugeMeter = ({ value }: { value: number }) => {
  const data = [{ value: 100 }]
  const boundedValue = Math.min(Math.max(value, 0), 100)
  const angle = -90 + (boundedValue * 180 / 100)
  
  return (
    <div className="h-48 w-full flex items-center justify-center relative">
      <div className="w-48">
        <ResponsiveContainer width="100%" height={192}>
          <RadialBarChart 
            innerRadius={60}
            outerRadius={80}
            data={data} 
            startAngle={180} 
            endAngle={0}
            barSize={20}
          >
            <defs>
              <linearGradient id="successGradient" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="50%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#EF4444" />
              </linearGradient>
            </defs>
            <RadialBar
              dataKey="value"
              fill="url(#successGradient)"
              background={{ fill: '#E5E7EB' }}
            />
            <g transform={`translate(100, 100) rotate(${angle})`}>
              <path
                d="M0,-40 L5,0 L-5,0 Z"
                fill="#1F2937"
                className="transition-transform duration-500 ease-out"
              />
              <circle r="6" fill="#1F2937" />
            </g>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className="absolute bottom-8 left-0 right-0 flex justify-between px-4 text-sm text-gray-600">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  )
}

const HintUsageBar = ({ value }: { value: number }) => {
  const MAX_HINTS = 4
  const percentage = (value / MAX_HINTS) * 100
  
  return (
    <div className="h-48 w-full flex flex-col items-center justify-center space-y-4">
      <div className="text-3xl font-bold text-purple-800">
        {value.toFixed(1)}
        <span className="text-lg text-purple-600 font-normal"> / {MAX_HINTS}</span>
      </div>
      
      <div className="w-full max-w-xs space-y-2">
        <div className="h-8 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-500 ease-out rounded-full"
            style={{ 
              width: `${percentage}%`,
              backgroundColor: percentage <= 25 ? '#22C55E' :
                            percentage <= 50 ? '#EAB308' :
                            percentage <= 75 ? '#F97316' :
                            '#EF4444'
            }} 
          />
        </div>
        <div className="flex justify-between text-sm text-gray-500 px-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="h-1 w-0.5 bg-gray-300 mb-1" />
              <span>{i}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const PerformanceStats = ({ successRate, averageHints }: { successRate: number, averageHints: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-green-50 p-6 rounded-lg">
        <Text size="lg" className="text-green-800 font-semibold text-center mb-4">
          Success Rate
        </Text>
        <GaugeMeter value={successRate} />
        <Text size="lg" className="text-center mt-4">
          {successRate.toFixed(1)}%
        </Text>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg">
        <Text size="lg" className="text-purple-800 font-semibold text-center mb-4">
          Average Hints
        </Text>
        <HintUsageBar value={averageHints} />
        <Text size="lg" className="text-center mt-4">
          {averageHints.toFixed(1)} hints
        </Text>
      </div>
    </div>
  )
} 