export interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
      {/* Animated circles container */}
      <div className="relative w-64 h-64">
        {/* Outer circle - slow, clockwise */}
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-sky-400 border-r-sky-300 animate-spin"
          style={{ animationDuration: '3s' }}
        />
        {/* Middle circle - medium speed, counter-clockwise */}
        <div
          className="absolute inset-6 rounded-full border-2 border-transparent border-t-amber-400 border-l-amber-300 animate-spin"
          style={{ animationDuration: '2s', animationDirection: 'reverse' }}
        />
        {/* Inner circle - fast, clockwise */}
        <div
          className="absolute inset-12 rounded-full border-2 border-transparent border-b-emerald-400 border-r-emerald-300 animate-spin"
          style={{ animationDuration: '1.2s' }}
        />
        {/* Center dot - pulsing size */}
        <div
          className="absolute inset-[115px] rounded-full bg-gradient-to-br from-violet-400 to-pink-400"
          style={{
            animation: 'pulse-scale 1.5s ease-in-out infinite',
          }}
        />
        <style>{`
          @keyframes pulse-scale {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.25); }
          }
        `}</style>
      </div>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  )
}
