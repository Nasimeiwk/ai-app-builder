import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Trash2,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Session } from "../backend.d";

interface SidebarProps {
  sessions: Session[];
  activeSessionId: bigint | null;
  onSelectSession: (id: bigint) => void;
  onNewChat: () => void;
  onDeleteSession: (id: bigint) => void;
  isCreating: boolean;
  onSettingsOpen: () => void;
  language?: "en" | "bn";
}

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp / 1_000_000n);
  const date = new Date(ms);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return date.toLocaleDateString("en", { month: "short", day: "numeric" });
}

export function SidebarContent({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  isCreating,
  onSettingsOpen,
  language = "en",
}: SidebarProps) {
  const [hoveredId, setHoveredId] = useState<bigint | null>(null);
  const [search, setSearch] = useState("");

  const filtered = sessions.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-sidebar-border min-h-[60px]">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex-shrink-0">
          <Zap className="w-4 h-4 text-primary" />
        </div>
        <div className="overflow-hidden">
          <span className="font-display font-bold text-foreground text-[15px] whitespace-nowrap tracking-tight">
            Caffeine AI
          </span>
          <p className="text-[10px] text-muted-foreground/60 whitespace-nowrap">
            App Builder
          </p>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="px-3 pt-3 pb-2">
        <Button
          data-ocid="sidebar.new_chat_button"
          onClick={onNewChat}
          disabled={isCreating}
          className="w-full justify-start gap-2.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/30 font-medium text-sm transition-all"
          variant="ghost"
        >
          <Plus className="w-4 h-4 flex-shrink-0" />
          <span className="whitespace-nowrap overflow-hidden">
            {isCreating
              ? language === "bn"
                ? "তৈরি হচ্ছে..."
                : "Creating..."
              : language === "bn"
                ? "নতুন চ্যাট"
                : "New Chat"}
          </span>
        </Button>
      </div>

      {/* Search */}
      {sessions.length > 0 && (
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40" />
            <Input
              data-ocid="sidebar.search_input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={language === "bn" ? "চ্যাট খুঁজুন..." : "Search chats..."}
              className="pl-8 h-8 text-xs bg-secondary/40 border-secondary/60 focus-visible:ring-primary/30 placeholder:text-muted-foreground/40"
            />
          </div>
        </div>
      )}

      {/* Sessions list */}
      <ScrollArea className="flex-1 px-2 scrollbar-thin">
        {filtered.length > 0 && (
          <div className="pb-4">
            <div className="flex items-center justify-between px-2 py-2">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground/40">
                {language === "bn" ? "সাম্প্রতিক চ্যাট" : "Recent Chats"}
              </p>
              <Badge
                variant="outline"
                className="text-[9px] border-border text-muted-foreground/50 bg-transparent px-1.5 py-0"
              >
                {filtered.length}
              </Badge>
            </div>
            {filtered.map((session, index) => {
              const isActive = session.id === activeSessionId;
              const isHovered = session.id === hoveredId;
              return (
                <motion.div
                  key={session.id.toString()}
                  data-ocid={`sidebar.session.item.${index + 1}`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ delay: index * 0.03 }}
                  onMouseEnter={() => setHoveredId(session.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`group relative flex items-center gap-2 rounded-lg px-2.5 py-2 mb-0.5 cursor-pointer session-item ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                  }`}
                  onClick={() => onSelectSession(session.id)}
                >
                  <MessageSquare
                    className={`w-3.5 h-3.5 flex-shrink-0 ${
                      isActive ? "text-primary" : "text-muted-foreground/50"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-[13px] font-medium truncate leading-tight ${
                        isActive ? "text-foreground" : ""
                      }`}
                    >
                      {session.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground/50 truncate">
                      {formatDate(session.createdAt)}
                    </p>
                  </div>
                  {isHovered && (
                    <button
                      type="button"
                      data-ocid={`sidebar.session.delete_button.${index + 1}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className="flex-shrink-0 p-1 rounded hover:bg-destructive/20 text-muted-foreground/40 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {search && filtered.length === 0 && (
          <div
            data-ocid="sidebar.empty_state"
            className="text-center py-8 px-4"
          >
            <p className="text-[12px] text-muted-foreground/40">
              {language === "bn" ? "কোনো চ্যাট পাওয়া যায়নি" : "No chats found"}
            </p>
          </div>
        )}
      </ScrollArea>

      {/* Footer with Settings */}
      <div className="px-3 py-3 border-t border-sidebar-border">
        <button
          type="button"
          data-ocid="sidebar.settings.button"
          onClick={onSettingsOpen}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground/60 hover:text-foreground hover:bg-sidebar-accent/60 transition-colors text-[13px]"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>{language === "bn" ? "সেটিংস" : "Settings"}</span>
        </button>
        <p className="text-[10px] text-muted-foreground/30 text-center mt-2">
          &copy; {new Date().getFullYear()}{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </>
  );
}

export function Sidebar(props: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 60 : 260 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative hidden md:flex flex-col h-full bg-sidebar border-r border-sidebar-border overflow-hidden flex-shrink-0"
    >
      {collapsed ? (
        /* Collapsed state: just icons */
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center px-2 py-4 border-b border-sidebar-border min-h-[60px]">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="px-2 pt-3">
            <button
              type="button"
              data-ocid="sidebar.new_chat_button"
              onClick={props.onNewChat}
              className="w-full flex items-center justify-center h-10 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1" />
          <div className="px-2 py-3 border-t border-sidebar-border">
            <button
              type="button"
              data-ocid="sidebar.settings.button"
              onClick={props.onSettingsOpen}
              className="w-full flex items-center justify-center h-10 rounded-lg text-muted-foreground/50 hover:text-foreground hover:bg-sidebar-accent/60 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <SidebarContent {...props} />
      )}

      {/* Collapse toggle */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-[72px] z-10 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-sm"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </motion.aside>
  );
}
