interface TaskOptionProps {
  option: string
  onSelect: () => void
}

export function TaskOption({ option, onSelect }: TaskOptionProps) {
  return (
    <button
      className="p-4 text-lg border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors duration-200"
      onClick={onSelect}
    >
      {option}
    </button>
  )
} 