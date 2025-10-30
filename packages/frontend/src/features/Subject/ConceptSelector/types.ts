export interface ConceptSelectorProps {
  subject: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  className?: string;
} 