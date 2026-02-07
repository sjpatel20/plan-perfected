import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MessageSquare, Menu, Sparkles, Leaf, Cloud, Banknote, FileText, PanelLeftClose, PanelLeft, Wrench, TrendingUp, Search, Sprout } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useExpertChat } from '@/hooks/useExpertChat';
import { ChatMessage } from '@/components/expert-chat/ChatMessage';
import { ChatInput } from '@/components/expert-chat/ChatInput';
import { ConversationList } from '@/components/expert-chat/ConversationList';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const QUICK_PROMPTS = [
  { icon: Leaf, label: 'Crop Disease', prompt: 'My wheat leaves are turning yellow with brown spots. What could be the problem?' },
  { icon: Cloud, label: 'Weather Advice', prompt: 'What is the weather forecast for Indore, Madhya Pradesh? Should I irrigate my field this week?' },
  { icon: Banknote, label: 'Market Prices', prompt: 'What are the current mandi prices for soybean in Madhya Pradesh?' },
  { icon: FileText, label: 'Government Schemes', prompt: 'What government schemes are available for crop insurance?' },
];

const TOOL_ICONS: Record<string, typeof Wrench> = {
  get_weather: Cloud,
  get_market_prices: TrendingUp,
  search_schemes: Search,
  analyze_crop_advice: Sprout,
};

const TOOL_LABELS: Record<string, string> = {
  get_weather: 'Weather',
  get_market_prices: 'Prices',
  search_schemes: 'Schemes',
  analyze_crop_advice: 'Crop Advice',
};

export default function ExpertChat() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const conversationId = searchParams.get('id') || undefined;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);

  const {
    conversations,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    isStreaming,
    streamingContent,
    toolsUsed,
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
        <div
          className={cn(
            'hidden md:flex border-r bg-muted/30 flex-col transition-all duration-300',
            desktopSidebarCollapsed ? 'w-0 overflow-hidden' : 'w-72'
          )}
        >
          {ConversationSidebar}
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b bg-background">
            {/* Mobile menu trigger */}
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

            {/* Desktop sidebar toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setDesktopSidebarCollapsed(!desktopSidebarCollapsed)}
              aria-label={desktopSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {desktopSidebarCollapsed ? (
                <PanelLeft className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-success to-primary flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold">AIkosh</h1>
                <p className="text-xs text-muted-foreground">AI-powered agricultural agent</p>
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
                  <h2 className="text-2xl font-bold mb-2">Ask AIkosh</h2>
                  <p className="text-muted-foreground mb-4">
                    Your AI-powered farming assistant with access to real-time weather, market prices, and government schemes.
                  </p>
                  
                  {/* Capability badges */}
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    <Badge variant="secondary" className="gap-1">
                      <Cloud className="h-3 w-3" /> Weather
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <TrendingUp className="h-3 w-3" /> Market Prices
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Search className="h-3 w-3" /> Govt Schemes
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Sprout className="h-3 w-3" /> Crop Advice
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {QUICK_PROMPTS.map((item) => (
                    <Card
                      key={item.label}
                      className="cursor-pointer hover:bg-muted/50 transition-colors group"
                      onClick={() => handleQuickPrompt(item.prompt)}
                    >
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
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
                {/* Show tools used indicator after response completes */}
                {toolsUsed.length > 0 && !isStreaming && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground px-4 py-2 bg-muted/30 rounded-lg">
                    <Wrench className="h-3 w-3" />
                    <span>Tools used:</span>
                    {toolsUsed.map((tool) => {
                      const Icon = TOOL_ICONS[tool] || Wrench;
                      return (
                        <Badge key={tool} variant="outline" className="gap-1 text-xs">
                          <Icon className="h-3 w-3" />
                          {TOOL_LABELS[tool] || tool}
                        </Badge>
                      );
                    })}
                  </div>
                )}
                
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
                ))}
                
                {/* Streaming indicator with tool use */}
                {isStreaming && (
                  <>
                    {toolsUsed.length > 0 && !streamingContent && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground px-4 py-3 bg-muted/30 rounded-lg animate-pulse">
                        <Wrench className="h-4 w-4 animate-spin" />
                        <span>Fetching data from {toolsUsed.map(t => TOOL_LABELS[t] || t).join(', ')}...</span>
                      </div>
                    )}
                    {streamingContent && (
                      <ChatMessage role="assistant" content={streamingContent} isStreaming />
                    )}
                  </>
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
                placeholder="Ask about weather, prices, schemes, crop advice..."
              />
              <p className="text-xs text-center text-muted-foreground mt-2">
                AIkosh connects to real data sources for accurate, up-to-date information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
