'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWidget() {
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState('');
  const [targetLang, setTargetLang] = useState<'zh-CN' | 'es'>('zh-CN');
  const inputRef = useRef<HTMLInputElement>(null);

  const send = async () => {
    const text = prompt.trim();
    if (!text) return;
    // show user message
    setMsgs(prev => [...prev, { role: 'user', content: text }]);
    setPrompt('');
    // call API route
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: text, targetLang }),
    });
    const { answer } = await res.json();
    setMsgs(prev => [...prev, { role: 'assistant', content: answer }]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="space-y-2 mb-4">
        {msgs.map((m, i) => (
          <div
            key={i}
            className={`flex mb-2 items-start ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-xs ${
                m.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <div className="mb-2">
        <select
          value={targetLang}
          onChange={e => setTargetLang(e.target.value as 'zh-CN' | 'es')}
          className="w-full border px-2 py-1 mb-2"
        >
          <option value="zh-CN">Simplified Chinese</option>
          <option value="es">Spanish</option>
        </select>
      </div>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          className="flex-1 border px-2 py-1"
          placeholder="Type your message..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={send}
          className="bg-green-600 text-white px-4 py-1 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}