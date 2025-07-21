import { useState, useRef, useEffect } from 'react';
import { ChatBubble } from '@/components/ChatBubble';
import { ChatInput } from '@/components/ChatInput';
import { GeminiService, ChatMessage } from '@/services/geminiService';
import { useToast } from '@/hooks/use-toast';
import { Bot, Sparkles } from 'lucide-react';

const geminiService = new GeminiService();

const Index = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm your AI assistant powered by Gemini. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Add loading message
    const loadingMessage: ChatMessage = {
      id: 'loading',
      text: '',
      isUser: false,
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, loadingMessage]);

    try {
      const response = await geminiService.sendMessage(messageText);
      
      // Remove loading message and add AI response
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => msg.id !== 'loading');
        return [...withoutLoading, {
          id: (Date.now() + 1).toString(),
          text: response,
          isUser: false,
          timestamp: new Date(),
        }];
      });
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove loading message and add error message
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => msg.id !== 'loading');
        return [...withoutLoading, {
          id: (Date.now() + 1).toString(),
          text: "I'm sorry, I encountered an error. Please try again.",
          isUser: false,
          timestamp: new Date(),
        }];
      });

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-chat flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center p-6 border-b border-border bg-gradient-secondary/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bot className="h-8 w-8 text-primary" />
            <Sparkles className="h-4 w-4 text-primary absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Gemini AI Assistant
            </h1>
            <p className="text-sm text-muted-foreground">Powered by Google's Gemini 2.0</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
              isLoading={message.isLoading}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="max-w-4xl mx-auto w-full">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Index;
