import React from 'react';
import ReactMarkdown from 'react-markdown';

const ChatMessage = ({ message }) => {
  const isUser = message.author === 'human';

  // Function to render code blocks in markdown
  const renderMarkdown = (content) => {
    return (
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline ? (
              <pre className="bg-gray-800 text-white p-3 rounded">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className="bg-gray-100 px-1 py-0.5 rounded" {...props}>
                {children}
              </code>
            );
          },
          p({ children }) {
            return <p className="mb-2">{children}</p>;
          },
          ul({ children }) {
            return <ul className="list-disc pl-5 mb-2">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-5 mb-2">{children}</ol>;
          },
          li({ children }) {
            return <li className="mb-1">{children}</li>;
          },
          h1({ children }) {
            return <h1 className="text-xl font-bold mb-2">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-lg font-bold mb-2">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-md font-bold mb-2">{children}</h3>;
          },
          blockquote({ children }) {
            return <blockquote className="border-l-4 border-gray-300 pl-3 italic mb-2">{children}</blockquote>;
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto mb-2">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded">{children}</table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-gray-50">{children}</thead>;
          },
          tbody({ children }) {
            return <tbody className="divide-y divide-gray-200">{children}</tbody>;
          },
          tr({ children }) {
            return <tr>{children}</tr>;
          },
          th({ children }) {
            return <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{children}</th>;
          },
          td({ children }) {
            return <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{children}</td>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <div
      className={`flex ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-3xl rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-blue-100 text-blue-900'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        {!isUser && (
          <div className="flex items-center mb-1">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-600 text-white">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.0681 2.00692C10.6502 1.55144 11.3149 1.30078 12 1.30078C12.6851 1.30078 13.3498 1.55144 13.9319 2.00692L21.0827 7.50175C21.4966 7.82771 21.8336 8.24566 22.0703 8.72118C22.307 9.19669 22.4373 9.7184 22.4519 10.2499C22.4664 10.7815 22.3649 11.3098 22.1543 11.7978C21.9437 12.2859 21.6296 12.7214 21.2338 13.0682L13.9319 18.9931C13.3498 19.4486 12.6851 19.6992 12 19.6992C11.3149 19.6992 10.6502 19.4486 10.0681 18.9931L2.76615 13.0682C2.37039 12.7214 2.05634 12.2859 1.84573 11.7978C1.63513 11.3098 1.53361 10.7815 1.54811 10.2499C1.56262 9.7184 1.69299 9.19669 1.92967 8.72118C2.16635 8.24566 2.50344 7.82771 2.91731 7.50175L10.0681 2.00692Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="ml-2 text-xs font-medium text-gray-500">K8s Assistant</span>
          </div>
        )}
        <div className="text-sm prose">
          {renderMarkdown(message.output)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;