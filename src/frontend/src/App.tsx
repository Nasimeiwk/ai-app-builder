import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Session } from "./backend.d";
import { ChatArea } from "./components/ChatArea";
import { MobileBottomNav, MobileHeader } from "./components/MobileNav";
import { PreviewPanel } from "./components/PreviewPanel";
import { SettingsModal } from "./components/SettingsModal";
import type { SettingsState } from "./components/SettingsModal";
import { Sidebar, SidebarContent } from "./components/Sidebar";
import {
  useAddMessage,
  useCreateSession,
  useDeleteSession,
  useGetMessages,
  useListSessions,
} from "./hooks/useQueries";
import { getAIResponse } from "./lib/aiResponses";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2, staleTime: 30_000 } },
});

function AppInner() {
  const [activeSessionId, setActiveSessionId] = useState<bigint | null>(null);
  const [isAITyping, setIsAITyping] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [settings, setSettings] = useState<SettingsState>(() => ({
    systemPrompt: localStorage.getItem("systemPrompt") || "",
    language: (localStorage.getItem("language") as "en" | "bn") || "en",
    model: localStorage.getItem("model") || "GPT-4o",
  }));

  const { data: sessions = [], isLoading: isLoadingSessions } =
    useListSessions();
  const { data: messages = [], isLoading: isLoadingMessages } =
    useGetMessages(activeSessionId);
  const createSession = useCreateSession();
  const deleteSession = useDeleteSession();
  const addMessage = useAddMessage();

  const activeSession: Session | null =
    activeSessionId !== null
      ? (sessions.find((s) => s.id === activeSessionId) ?? null)
      : null;

  const handleNewChat = async () => {
    try {
      const session = await createSession.mutateAsync(
        settings.language === "bn" ? "নতুন চ্যাট" : "New Chat",
      );
      setActiveSessionId(session.id);
      setMobileSidebarOpen(false);
    } catch {
      toast.error(
        settings.language === "bn"
          ? "চ্যাট তৈরি করতে ব্যর্থ"
          : "Failed to create chat session",
      );
    }
  };

  const handleSelectSession = (id: bigint) => {
    setActiveSessionId(id);
    setMobileSidebarOpen(false);
  };

  const handleDeleteSession = async (id: bigint) => {
    try {
      await deleteSession.mutateAsync(id);
      if (activeSessionId === id) setActiveSessionId(null);
      toast.success(
        settings.language === "bn" ? "চ্যাট মুছে ফেলা হয়েছে" : "Chat deleted",
      );
    } catch {
      toast.error(
        settings.language === "bn" ? "চ্যাট মুছতে ব্যর্থ" : "Failed to delete chat",
      );
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!activeSessionId) return;

    const fullContent = settings.systemPrompt
      ? `[System: ${settings.systemPrompt}]\n\n${content}`
      : content;

    try {
      await addMessage.mutateAsync({
        sessionId: activeSessionId,
        role: "user",
        content,
      });

      setIsAITyping(true);
      const delay = 1000 + Math.random() * 1000;
      await new Promise((r) => setTimeout(r, delay));

      const aiResponse = getAIResponse(fullContent);
      setIsAITyping(false);

      await addMessage.mutateAsync({
        sessionId: activeSessionId,
        role: "assistant",
        content: aiResponse,
      });
    } catch {
      setIsAITyping(false);
      toast.error(
        settings.language === "bn" ? "বার্তা পাঠাতে ব্যর্থ" : "Failed to send message",
      );
    }
  };

  const sidebarProps = {
    sessions,
    activeSessionId,
    onSelectSession: handleSelectSession,
    onNewChat: handleNewChat,
    onDeleteSession: handleDeleteSession,
    isCreating: createSession.isPending || isLoadingSessions,
    onSettingsOpen: () => setSettingsOpen(true),
    language: settings.language,
  };

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <Sidebar {...sidebarProps} />

      {/* Mobile Sidebar as Sheet */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent
          side="left"
          className="w-[280px] p-0 bg-sidebar border-sidebar-border flex flex-col"
        >
          <SidebarContent {...sidebarProps} />
        </SheetContent>
      </Sheet>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <MobileHeader
          onOpenSidebar={() => setMobileSidebarOpen(true)}
          onNewChat={handleNewChat}
          onOpenSettings={() => setSettingsOpen(true)}
          sessionTitle={activeSession?.title}
        />

        {/* Chat + Preview split */}
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 flex overflow-hidden min-w-0">
            <ChatArea
              session={activeSession}
              messages={messages}
              isLoadingMessages={isLoadingMessages && activeSessionId !== null}
              isAITyping={isAITyping}
              onSendMessage={handleSendMessage}
              isSending={addMessage.isPending}
              showPreview={showPreview}
              onTogglePreview={() => setShowPreview((p) => !p)}
              systemPrompt={settings.systemPrompt}
              language={settings.language}
            />
          </main>

          {/* Desktop Preview Panel */}
          <AnimatePresence>
            {showPreview && (
              <PreviewPanel
                messages={messages}
                onClose={() => setShowPreview(false)}
                className="hidden md:flex w-[380px] xl:w-[440px] flex-shrink-0"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Mobile bottom nav */}
        <MobileBottomNav
          onNewChat={handleNewChat}
          onOpenSidebar={() => setMobileSidebarOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      </div>

      {/* Settings Modal */}
      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onSettingsChange={setSettings}
      />

      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "oklch(0.17 0.014 250)",
            border: "1px solid oklch(0.24 0.014 250)",
            color: "oklch(0.93 0.01 240)",
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
