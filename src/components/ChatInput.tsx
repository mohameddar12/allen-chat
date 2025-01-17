import { FormEvent, useRef, useState } from 'react';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSubmit(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4">
          <div className="relative">
            <textarea
              ref={textareaRef}
              rows={1}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as any);
                }
              }}
              placeholder="Message ChatGPT..."
              className="w-full resize-none rounded-lg pr-10 pl-4 py-3 bg-white border focus:border-green-500 focus:ring-0 focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="absolute right-2 bottom-2.5 text-gray-400 hover:text-gray-600 disabled:hover:text-gray-400 disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </div>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => setMessage("What's the weather like?")}
              className="px-3 py-1 text-sm text-gray-500 bg-white border rounded-md hover:bg-gray-50"
            >
              What's the weather like?
            </button>
            <button
              type="button"
              onClick={() => setMessage("Tell me a joke")}
              className="px-3 py-1 text-sm text-gray-500 bg-white border rounded-md hover:bg-gray-50"
            >
              Tell me a joke
            </button>
            <button
              type="button"
              onClick={() => setMessage("How does photosynthesis work?")}
              className="px-3 py-1 text-sm text-gray-500 bg-white border rounded-md hover:bg-gray-50"
            >
              How does photosynthesis work?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 