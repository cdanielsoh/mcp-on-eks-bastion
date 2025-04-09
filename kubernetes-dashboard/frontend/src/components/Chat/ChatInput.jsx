import React, { useState } from 'react';
import { useChatInteract, useChatData } from '@chainlit/react-client';

const ChatInput = () => {
  const [input, setInput] = useState('');
  const { sendMessage } = useChatInteract();
  const { loading } = useChatData();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // Send message
    sendMessage({
      output: input,
      author: 'human'
    });

    // Clear input
    setInput('');
  };

  // Example commands
  const exampleCommands = [
    "List pods in kube-system namespace",
    "Describe node details",
    "Scale deployment frontend to 3 replicas",
    "Show logs for nginx pods"
  ];

  const insertExampleCommand = (command) => {
    setInput(command);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <div className="flex-grow relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Type your message..."
            className="block w-full pl-4 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className={`inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            !input.trim() || loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          )}
        </button>
      </form>

      {/* Example commands */}
      <div className="mt-3">
        <p className="text-xs text-gray-500 mb-2">Try asking:</p>
        <div className="flex flex-wrap gap-2">
          {exampleCommands.map((command, index) => (
            <button
              key={index}
              onClick={() => insertExampleCommand(command)}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-gray-700"
            >
              {command}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;