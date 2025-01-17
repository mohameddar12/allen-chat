interface SampleQuestionProps {
  text: string;
  onClick: () => void;
}

export default function SampleQuestion({ text, onClick }: SampleQuestionProps) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
    >
      {text}
    </button>
  );
} 