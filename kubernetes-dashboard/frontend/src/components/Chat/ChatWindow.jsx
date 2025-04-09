import React, { useEffect, useRef } from 'react';
import { useChatMessages, useChatInteract, useChatData } from '@chainlit/react-client';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const ChatWindow = () => {
  const { messages } = useChatMessages();
  const { clear } = useChatInteract();
  const { loading } = useChatData();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter JSON messages from the chatbot (those that appear to be data responses)
  const filteredMessages = messages.filter(message => {
    // Try to parse as JSON to see if it's a data response
    try {
      const content = message.output;
      const parsed = JSON.parse(content);
      // If it has specific data structures we use for our UI, filter it out
      return !(parsed.hasOwnProperty('pods') ||
               parsed.hasOwnProperty('success') ||
               parsed.hasOwnProperty('clusters') ||
               parsed.hasOwnProperty('error'));
    } catch (e) {
      // Not JSON, so it's a normal message - keep it
      return true;
    }
  });

  return (
    <div className="flex flex-col h-full max-h-full bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Chat with Kubernetes Assistant
          </h2>
          <button
            onClick={clear}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear chat
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Ask questions about your Kubernetes cluster or request actions
        </p>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-6">
        <div className="space-y-6">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-10">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start a conversation with your Kubernetes assistant.
              </p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
              />
            ))
          )}
          {loading && (
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-100"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-200"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatWindow;