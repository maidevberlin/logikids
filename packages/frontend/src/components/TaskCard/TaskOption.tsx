interface TaskOptionProps {
  onSelect: () => void
  label: string
  disabled?: boolean
  variant?: 'primary' | 'success' | 'secondary' | 'warning'
}

export function TaskOption({ 
  onSelect, 
  label, 
  disabled = false,
  variant = 'primary' 
}: TaskOptionProps) {
  const variantClasses = {
    primary: 'bg-primary-500 hover:bg-primary-600 focus:ring-primary-500',
    success: 'bg-green-500 hover:bg-green-600 focus:ring-green-500',
    secondary: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500',
    warning: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500'
  }

  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={`
        px-4 py-2 rounded text-white
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
        ${variantClasses[variant]}
      `}
    >
      {label}
    </button>
  )
} 