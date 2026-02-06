import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MessageSquare, Menu, Sparkles, Leaf, Cloud, Banknote, FileText } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useExpertChat } from '@/hooks/useExpertChat';
import { ChatMessage } from '@/components/expert-chat/ChatMessage';
import { ChatInput } from '@/components/expert-chat/ChatInput';
import { ConversationList } from '@/components/expert-chat/ConversationList';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const QUICK_PROMPTS = [
  { icon: Leaf, label: 'Crop Disease', prompt: 'My wheat leaves are turning yellow with brown spots. What could be the problem?' },
  { icon: Cloud, label: 'Weather Advice', prompt: 'Heavy rain is expected next week. What precautions should I take for my standing crop?' },
  { icon: Banknote, label: 'Government Schemes', prompt: 'What are the latest government schemes for farmers that I can apply for?' },
  { icon: FileText, label: 'Best Practices', prompt: 'What is the best time and method to sow wheat in North India?' },
];

export default function ExpertChat() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const conversationId = searchParams.get('id') || undefined;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    conversations,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    isStreaming,
    streamingContent,
    createConversation,
    sendMessage,
    deleteConversation,
  } = useExpertChat(conversationId);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const handleNewConversation = async () => {
    const conv = await createConversation.mutateAsync('New Conversation');
    setSearchParams({ id: conv.id });
    setSidebarOpen(false);
  };

  const handleSelectConversation = (id: string) => {
    setSearchParams({ id });
    setSidebarOpen(false);
  };

  const handleDeleteConversation = async (id: string) => {
    await deleteConversation.mutateAsync(id);
    if (id === conversationId) {
      setSearchParams({});
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!conversationId) {
      // Create new conversation first
      const conv = await createConversation.mutateAsync('New Conversation');
      setSearchParams({ id: conv.id });
      // Wait for state to update, then send
      setTimeout(() => sendMessage(content), 100);
    } else {
      await sendMessage(content);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const ConversationSidebar = (
    <ConversationList
      conversations={conversations}
      currentId={conversationId}
      onSelect={handleSelectConversation}
      onNew={handleNewConversation}
      onDelete={handleDeleteConversation}
    />
  );

  return (
    <AppLayout>
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex w-72 border-r bg-muted/30 flex-col">
          {ConversationSidebar}
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b bg-background">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                {ConversationSidebar}
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-success to-primary flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold">Expert Chat</h1>
                <p className="text-xs text-muted-foreground">AI-powered agricultural advisor</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            {!conversationId || messages.length === 0 ? (
              <div className="max-w-2xl mx-auto py-8">
                <div className="text-center mb-8">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-success to-primary flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Ask an Expert</h2>
                  <p className="text-muted-foreground">
                    Get instant guidance on crop management, weather, government schemes, and more.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {QUICK_PROMPTS.map((item) => (
                    <Card
                      key={item.label}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleQuickPrompt(item.prompt)}
                    >
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <item.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.label}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{item.prompt}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-4">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
                ))}
                {isStreaming && streamingContent && (
                  <ChatMessage role="assistant" content={streamingContent} isStreaming />
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t bg-background">
            <div className="max-w-3xl mx-auto">
              <ChatInput
                onSend={handleSendMessage}
                isLoading={isStreaming}
                placeholder="Ask about crops, weather, schemes, best practices..."
              />
              <p className="text-xs text-center text-muted-foreground mt-2">
                Kisan Mitra Expert provides general guidance. For critical decisions, consult local KVK.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
