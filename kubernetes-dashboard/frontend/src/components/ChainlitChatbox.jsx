import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Stack, CircularProgress, Typography, Avatar, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useChatMessages, useChatInteract, useChatData } from '@chainlit/react-client';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * Chat interface component that connects to Chainlit backend
 */
function ChainlitChatbox() {
  const { messages } = useChatMessages();
  const { sendMessage } = useChatInteract();
  const { loading } = useChatData();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom of chat when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message to Chainlit
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    try {
      await sendMessage({ content: input });
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Handle "Enter" key press in input field
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Custom renderer for code blocks
  const renderers = {
    code({node, inline, className, children, ...props}) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={atomDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Chat messages area */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2, pr: 1 }}>
        {messages.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="body2" color="text.secondary">
              Type a message to start chatting with the Kubernetes assistant
            </Typography>
          </Box>
        ) : (
          messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                mb: 2,
                flexDirection: msg.author === 'user' ? 'row-reverse' : 'row'
              }}
            >
              <Avatar
                sx={{
                  bgcolor: msg.author === 'user' ? 'primary.main' : 'secondary.main',
                  width: 32,
                  height: 32,
                  mr: msg.author === 'user' ? 0 : 1,
                  ml: msg.author === 'user' ? 1 : 0
                }}
              >
                {msg.author === 'user' ? 'U' : 'K'}
              </Avatar>

              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  maxWidth: '80%',
                  bgcolor: msg.author === 'user' ? 'primary.50' : 'background.paper',
                  borderRadius: 2
                }}
              >
                <ReactMarkdown components={renderers}>
                  {msg.content}
                </ReactMarkdown>
              </Paper>
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Processing indicator */}
      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CircularProgress size={16} sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Processing your request...
          </Typography>
        </Box>
      )}

      {/* Message input area */}
      <Stack direction="row" spacing={1}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask something about your Kubernetes cluster..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          multiline
          maxRows={4}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
          endIcon={<SendIcon />}
        >
          Send
        </Button>
      </Stack>
    </Box>
  );
}

export default ChainlitChatbox;