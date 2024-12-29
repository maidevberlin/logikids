interface TaskContentProps {
  title: string;
  description: string;
}

export function TaskContent({ title, description }: TaskContentProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">
        {title}
      </h2>
      <div 
        className="prose prose-blue max-w-none"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  )
} 