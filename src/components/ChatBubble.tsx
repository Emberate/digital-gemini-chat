import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: Date;
  isLoading?: boolean;
}

export const ChatBubble = ({ message, isUser, timestamp, isLoading }: ChatBubbleProps) => {
  return (
    <div className={cn(
      "flex w-full mb-4 animate-in slide-in-from-bottom-2 duration-500",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] px-4 py-3 rounded-2xl transition-all duration-300",
        isUser 
          ? "bg-user-bubble text-primary-foreground rounded-br-md shadow-glow-primary" 
          : "bg-ai-bubble text-foreground rounded-bl-md border border-border"
      )}>
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-100"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-200"></div>
            </div>
            <span className="text-muted-foreground text-sm">AI is thinking...</span>
          </div>
        ) : (
          <>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
            {timestamp && (
              <p className="text-xs text-muted-foreground mt-2 opacity-70">
                {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};