'use client';

import { useState } from 'react';
import { Play, Square } from 'lucide-react';

interface TextToSpeechProps {
  text: string;
}

export default function TextToSpeech({ text }: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handleSpeak = async () => {
    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const newAudio = new Audio(audioUrl);
      
      setAudio(newAudio);
      newAudio.play();
      setIsPlaying(true);

      newAudio.onended = () => {
        setIsPlaying(false);
      };
    } catch (error) {
      console.error('Error generating speech:', error);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <button
      onClick={isPlaying ? handleStop : handleSpeak}
      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
      title={isPlaying ? "Stop speaking" : "Play message"}
    >
      {isPlaying ? (
        <Square className="w-4 h-4 text-gray-500" />
      ) : (
        <Play className="w-4 h-4 text-gray-500" />
      )}
    </button>
  );
} 