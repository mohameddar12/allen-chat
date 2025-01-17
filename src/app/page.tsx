'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { UserCircle } from 'lucide-react';
import TextToSpeech from '@/components/TextToSpeech';
import Image from 'next/image';

// Sample questions that appear at the bottom
const SAMPLE_QUESTIONS = [
  "what's your freaking workout routine bo?",
  "give me your hottest take on crypto bo",
  "rate my rizz game",
  "teach me some gym slang bo"
];

// Initial greeting message
const INITIAL_MESSAGE: Message = {
  text: "yo what's freaking good bo!! i'm allen, and i'm freaking built different fr fr. listen bo, i'll help you level up your game, but don't come at me with no boshit bo. momo is my freaking brotha!!",
  isUser: false,
  role: "assistant" as const
};

type Message = {
  text: string;
  isUser: boolean;
  role: "user" | "assistant";
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set initial message after component mounts
  useEffect(() => {
    setMounted(true);
    setMessages([INITIAL_MESSAGE]);
  }, []);

  const handleSubmit = async (e: React.FormEvent | string) => {
    if (typeof e !== 'string' && e?.preventDefault) {
      e.preventDefault();
    }
    const messageText = typeof e === 'string' ? e : input;
    if (!messageText.trim() || isLoading) return;

    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage: Message = { text: messageText, isUser: true, role: "user" };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      // Get bot response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageText,
          history: messages.map(msg => ({
            role: msg.role,
            content: msg.text
          }))
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      // Add bot message
      setMessages(prev => [...prev, { 
        text: Array.isArray(data.response) ? data.response.join('') : data.response,
        isUser: false,
        role: "assistant"
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: "I apologize, but I encountered an error. Please try again.",
        isUser: false,
        role: "assistant"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render anything until after hydration
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Main chat area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 1 && (
          <div className="text-center pt-8 pb-4">
            <h1 className="text-4xl font-bold text-gray-900">Chat with Allen</h1>
            <p className="text-gray-600 mt-2">Your brotha Allen! (in AI)</p>
          </div>
        )}
        <div className="max-w-3xl mx-auto pt-4 pb-24">
          {messages.map((message, i) => (
            <div key={i} className="px-4 mb-6">
              <div className={`flex items-start gap-3 ${message.isUser ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className="flex-shrink-0 w-8 h-8">
                  {message.isUser ? (
                    <div className="w-full h-full bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-red-600">U</span>
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <Image
                        src="/images/allen-avatar.png"
                        alt="Allen's avatar"
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Message content */}
                <div className={`flex flex-col max-w-[80%] ${message.isUser ? 'items-end' : 'items-start'}`}>
                  <div className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                    {message.isUser ? 'You' : 'Allen'}
                    {!message.isUser && <TextToSpeech text={message.text} />}
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      message.isUser
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="px-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <Image
                      src="/images/allen-avatar.png"
                      alt="Allen's avatar"
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-gray-600 mb-1">Allen</div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-2">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-2">
          {/* Sample questions */}
          {messages.length === 1 && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {SAMPLE_QUESTIONS.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSubmit(question)}
                  className="text-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-600 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="yo say something bo..."
              className="w-full pl-4 pr-12 py-3 bg-gray-50 rounded-lg text-gray-900 text-sm focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              aria-label="Send message"
            >
              <svg 
                viewBox="0 0 24 24" 
                className="w-5 h-5 text-blue-500 hover:text-blue-600 transition-colors disabled:opacity-50"
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path 
                  d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
