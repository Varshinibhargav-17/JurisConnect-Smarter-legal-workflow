'use client';
import { useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I help you today?', sender: 'ai' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      // Simulate AI response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: 'This is an AI response.', sender: 'ai' },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-[85vh]">
      <h1 className="text-2xl font-semibold mb-4">AI Chat</h1>
      <div className="flex-1 overflow-y-auto p-4 bg-white rounded-lg shadow">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 ${
              msg.sender === 'ai' ? 'text-left' : 'text-right'
            }`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                msg.sender === 'ai' ? 'bg-gray-200' : 'bg-blue-500 text-white'
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          className="flex-1 p-2 border rounded-l-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
