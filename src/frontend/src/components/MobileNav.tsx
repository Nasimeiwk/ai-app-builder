import { Button } from "@/components/ui/button";
import { History, Menu, MessageSquarePlus, Settings, Zap } from "lucide-react";

interface MobileHeaderProps {
  onOpenSidebar: () => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
  sessionTitle?: string;
}

export function MobileHeader({
  onOpenSidebar,
  onNewChat,
  onOpenSettings,
  sessionTitle,
}: MobileHeaderProps) {
  return (
    <header className="md:hidden flex items-center gap-2 px-3 py-2.5 bg-sidebar border-b border-sidebar-border min-h-[52px] flex-shrink-0">
      <Button
        data-ocid="mobile.menu.button"
        variant="ghost"
        size="sm"
        onClick={onOpenSidebar}
        className="h-10 w-10 p-0 hover:bg-sidebar-accent"
      >
        <Menu className="w-5 h-5 text-sidebar-foreground" />
      </Button>

      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <div className="w-6 h-6 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
          <Zap className="w-3.5 h-3.5 text-primary" />
        </div>
        <span className="font-display font-bold text-foreground text-sm truncate">
          {sessionTitle || "Caffeine AI"}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          data-ocid="mobile.settings.button"
          variant="ghost"
          size="sm"
          onClick={onOpenSettings}
          className="h-10 w-10 p-0 hover:bg-sidebar-accent"
        >
          <Settings className="w-4.5 h-4.5 text-sidebar-foreground/70" />
        </Button>
        <Button
          data-ocid="mobile.new_chat.button"
          variant="ghost"
          size="sm"
          onClick={onNewChat}
          className="h-10 w-10 p-0 hover:bg-sidebar-accent"
        >
          <MessageSquarePlus className="w-4.5 h-4.5 text-primary" />
        </Button>
      </div>
    </header>
  );
}

interface MobileBottomNavProps {
  onNewChat: () => void;
  onOpenSidebar: () => void;
  onOpenSettings: () => void;
}

export function MobileBottomNav({
  onNewChat,
  onOpenSidebar,
  onOpenSettings,
}: MobileBottomNavProps) {
  return (
    <nav className="md:hidden flex items-center justify-around border-t border-border bg-sidebar pb-safe flex-shrink-0 min-h-[56px]">
      <button
        type="button"
        data-ocid="mobile.bottom_new_chat.button"
        onClick={onNewChat}
        className="flex flex-col items-center gap-0.5 py-2 px-5 text-muted-foreground hover:text-primary transition-colors min-h-[44px] justify-center"
      >
        <MessageSquarePlus className="w-5 h-5" />
        <span className="text-[9px] font-medium">New Chat</span>
      </button>

      <button
        type="button"
        data-ocid="mobile.bottom_history.button"
        onClick={onOpenSidebar}
        className="flex flex-col items-center gap-0.5 py-2 px-5 text-muted-foreground hover:text-primary transition-colors min-h-[44px] justify-center"
      >
        <History className="w-5 h-5" />
        <span className="text-[9px] font-medium">History</span>
      </button>

      <button
        type="button"
        data-ocid="mobile.bottom_settings.button"
        onClick={onOpenSettings}
        className="flex flex-col items-center gap-0.5 py-2 px-5 text-muted-foreground hover:text-primary transition-colors min-h-[44px] justify-center"
      >
        <Settings className="w-5 h-5" />
        <span className="text-[9px] font-medium">Settings</span>
      </button>
    </nav>
  );
}
