interface TaskOptionProps {
  option: string
  selected?: boolean
  correct: boolean | null
  onSelect: () => void
  disabled?: boolean
}

export function TaskOption({ 
  option, 
  selected = false, 
  correct = null,
  onSelect,
  disabled = false 
}: TaskOptionProps) {
  const baseStyles = "p-4 rounded-lg border text-lg font-medium transition-all duration-200"
  const getStyles = () => {
    if (!selected) {
      return `${baseStyles} border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer`
    }
    if (correct) {
      return `${baseStyles} border-green-500 bg-green-50 text-green-700`
    }
    return `${baseStyles} border-red-500 bg-red-50 text-red-700`
  }

  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={getStyles()}
    >
      {option}
    </button>
  )
} 