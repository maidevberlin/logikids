interface TaskOptionProps {
  onSelect: () => void
  label: string
}

export function TaskOption({ onSelect, label }: TaskOptionProps) {
  return (
    <button
      onClick={onSelect}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      {label}
    </button>
  )
} 