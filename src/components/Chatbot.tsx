import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Send, SmartToy, Person } from "@mui/icons-material";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatbotProps {
  onSendMessage?: (message: string) => Promise<string>;
}

const Chatbot: React.FC<ChatbotProps> = ({ onSendMessage }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI workout assistant. I can help you with workout recommendations, form tips, and fitness advice. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      let botResponse = "";

      if (onSendMessage) {
        botResponse = await onSendMessage(inputText);
      } else {
        // Mock response for demo purposes
        botResponse = await getMockResponse(inputText);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const getMockResponse = async (input: string): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const lowerInput = input.toLowerCase();

    if (lowerInput.includes("workout") || lowerInput.includes("exercise")) {
      return "I can help you create effective workout routines! What type of workout are you interested in? Cardio, strength training, or flexibility exercises?";
    }

    if (lowerInput.includes("form") || lowerInput.includes("technique")) {
      return "Proper form is crucial for preventing injuries and maximizing results. I can provide detailed form tips for specific exercises. Which exercise would you like to know more about?";
    }

    if (lowerInput.includes("schedule") || lowerInput.includes("plan")) {
      return "I can help you create a workout schedule that fits your lifestyle! How many days per week can you commit to working out?";
    }

    if (lowerInput.includes("nutrition") || lowerInput.includes("diet")) {
      return "Nutrition plays a vital role in your fitness journey. I can provide general guidance on macronutrients and meal timing. What are your specific nutrition goals?";
    }

    if (lowerInput.includes("motivation") || lowerInput.includes("motivated")) {
      return "Staying motivated can be challenging! Here are some tips: Set realistic goals, track your progress, find a workout buddy, and celebrate small victories. What motivates you most?";
    }

    return "That's a great question! I'm here to help with all your fitness-related inquiries. Feel free to ask about workouts, nutrition, form, or any other fitness topics!";
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "What's a good beginner workout?",
    "How do I improve my squat form?",
    "Create a 3-day workout plan",
    "What should I eat before a workout?",
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInputText(question);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        AI Workout Assistant
      </Typography>

      <Paper
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          mb: 2,
        }}
      >
        {/* Messages */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: "flex",
                justifyContent:
                  message.sender === "user" ? "flex-end" : "flex-start",
                alignItems: "flex-start",
                gap: 1,
              }}
            >
              {message.sender === "bot" && (
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <SmartToy />
                </Avatar>
              )}

              <Box
                sx={{
                  maxWidth: "70%",
                  p: 2,
                  borderRadius: 2,
                  bgcolor:
                    message.sender === "user" ? "primary.main" : "grey.100",
                  color: message.sender === "user" ? "white" : "text.primary",
                }}
              >
                <Typography variant="body1">{message.text}</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 1,
                    opacity: 0.7,
                    fontSize: "0.75rem",
                  }}
                >
                  {message.timestamp.toLocaleTimeString()}
                </Typography>
              </Box>

              {message.sender === "user" && (
                <Avatar sx={{ bgcolor: "secondary.main" }}>
                  <Person />
                </Avatar>
              )}
            </Box>
          ))}

          {isLoading && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar sx={{ bgcolor: "primary.main" }}>
                <SmartToy />
              </Avatar>
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: "grey.100" }}>
                <CircularProgress size={20} />
              </Box>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
            <Typography variant="subtitle2" gutterBottom>
              Suggested questions:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {suggestedQuestions.map((question, index) => (
                <Chip
                  key={index}
                  label={question}
                  onClick={() => handleSuggestedQuestion(question)}
                  variant="outlined"
                  size="small"
                  sx={{ cursor: "pointer" }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Input */}
        <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Ask me anything about workouts, nutrition, or fitness..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              multiline
              maxRows={3}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              <Send />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Chatbot;
