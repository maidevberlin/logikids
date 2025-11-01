import { useRandomGreeting } from './greetings'

export interface GreetingHeaderProps {
  name: string
}

export function GreetingHeader({ name }: GreetingHeaderProps) {
  const greeting = useRandomGreeting()

  return (
    <div className="text-center mb-12">
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
        {greeting.split(' ')[0]} {greeting.split(' ')[1]}, {name}!
      </h1>
      <p className="text-xl text-gray-600">
        What would you like to do today?
      </p>
    </div>
  )
}
