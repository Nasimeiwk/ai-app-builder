import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Eye, EyeOff, Info, Send, Sparkles, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Message, Session } from "../backend.d";
import { MessageContent } from "./MessageContent";

const SUGGESTION_PROMPTS = [
  {
    label: "Build a dashboard",
    desc: "Analytics dashboard with charts & metrics",
    emoji: "📊",
  },
  {
    label: "Create a REST API",
    desc: "Node.js backend with authentication",
    emoji: "⚡",
  },
  {
    label: "Design a database",
    desc: "PostgreSQL schema with relationships",
    emoji: "🗄️",
  },
  {
    label: "Add authentication",
    desc: "JWT auth with refresh tokens",
    emoji: "🔐",
  },
  {
    label: "Write unit tests",
    desc: "Jest test suite with coverage",
    emoji: "✅",
  },
  {
    label: "React components",
    desc: "Reusable TypeScript component library",
    emoji: "⚛️",
  },
];

const TEMPLATE_PROMPTS = [
  {
    tag: "Full Stack App",
    prompt:
      "Build a full-stack web application with React frontend, Node.js/Express backend, PostgreSQL database, JWT authentication, and RESTful API endpoints.",
  },
  {
    tag: "Mobile App",
    prompt:
      "Create a React Native mobile app with navigation, state management using Redux Toolkit, push notifications, and offline support.",
  },
  {
    tag: "REST API",
    prompt:
      "Generate a complete REST API with Express.js including CRUD operations, input validation with Zod, error handling middleware, rate limiting, and Swagger documentation.",
  },
  {
    tag: "Database Schema",
    prompt:
      "Design a PostgreSQL database schema for a multi-tenant SaaS application with users, organizations, roles, permissions, audit logs, and optimized indexes.",
  },
  {
    tag: "Authentication",
    prompt:
      "Implement a complete authentication system with JWT access/refresh tokens, OAuth2 (Google, GitHub), email verification, password reset, and 2FA support.",
  },
  {
    tag: "Testing Suite",
    prompt:
      "Write a comprehensive testing suite with Jest including unit tests, integration tests, and end-to-end tests with Playwright. Include mocking, coverage reporting, and CI/CD integration.",
  },
];

interface ChatAreaProps {
  session: Session | null;
  messages: Message[];
  isLoadingMessages: boolean;
  isAITyping: boolean;
  onSendMessage: (content: string) => void;
  isSending: boolean;
  showPreview?: boolean;
  onTogglePreview?: () => void;
  systemPrompt?: string;
  language?: "en" | "bn";
}

interface ChatInputProps {
  input: string;
  setInput: (v: string) => void;
  onSubmit: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  disabled: boolean;
  placeholder: string;
  systemPrompt?: string;
  language?: "en" | "bn";
}

function ChatInput({
  input,
  setInput,
  onSubmit,
  onKeyDown,
  textareaRef,
  disabled,
  placeholder,
  systemPrompt,
  language,
}: ChatInputProps) {
  return (
    <div className="space-y-2">
      {systemPrompt?.trim() && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 px-1"
        >
          <Info className="w-3 h-3 text-primary/60" />
          <Badge
            variant="outline"
            className="text-[10px] border-primary/25 text-primary/70 bg-primary/5 font-normal max-w-[250px]"
          >
            <span className="truncate">
              {language === "bn"
                ? "সিস্টেম প্রম্পট সক্রিয়"
                : "System prompt active"}
            </span>
          </Badge>
        </motion.div>
      )}
      <div className="relative flex items-end gap-2 bg-card border border-border rounded-2xl p-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
        <Textarea
          data-ocid="chat.input"
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="flex-1 resize-none border-0 bg-transparent focus-visible:ring-0 text-sm text-foreground placeholder:text-muted-foreground/40 min-h-[44px] max-h-[160px] py-2.5 px-2 scrollbar-thin"
          rows={1}
        />
        <Button
          data-ocid="chat.submit_button"
          onClick={onSubmit}
          disabled={!input.trim() || disabled}
          size="sm"
          className="rounded-xl w-9 h-9 p-0 flex-shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-30"
        >
          <Send className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function ChatArea({
  session,
  messages,
  isLoadingMessages,
  isAITyping,
  onSendMessage,
  isSending,
  showPreview,
  onTogglePreview,
  systemPrompt,
  language = "en",
}: ChatAreaProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesLength = messages.length;

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll when message count or typing state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesLength, isAITyping]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isSending || isAITyping) return;
    setInput("");
    onSendMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestion = (label: string) => {
    setInput(label);
    textareaRef.current?.focus();
  };

  const t = (en: string, bn: string) => (language === "bn" ? bn : en);

  if (!session) {
    return (
      <div
        data-ocid="chat.empty_state"
        className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-background overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-xl w-full text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center glow-primary">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary animate-pulse" />
            </div>
          </div>

          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-2">
            {t("Caffeine AI", "ক্যাফেইন AI")}
          </h1>
          <p className="text-muted-foreground text-[14px] md:text-[15px] mb-6 leading-relaxed">
            {t(
              "Your intelligent app builder. Describe what you want to build and I'll generate production-ready code instantly.",
              "আপনার বুদ্ধিমান অ্যাপ বিল্ডার। আপনি কী তৈরি করতে চান তা বর্ণনা করুন এবং আমি তাৎক্ষণিকভাবে প্রোডাকশন-রেডি কোড তৈরি করব।",
            )}
          </p>

          <div className="grid grid-cols-2 gap-2 mb-6">
            {SUGGESTION_PROMPTS.map((prompt) => (
              <motion.button
                type="button"
                key={prompt.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSuggestion(prompt.label)}
                className="text-left p-3 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-start gap-2">
                  <span className="text-base">{prompt.emoji}</span>
                  <div>
                    <p className="text-xs md:text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {prompt.label}
                    </p>
                    <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">
                      {prompt.desc}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Templates */}
          <div className="border-t border-border pt-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-3">
              {t("Quick Templates", "দ্রুত টেমপ্লেট")}
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {TEMPLATE_PROMPTS.map((tpl) => (
                <motion.button
                  type="button"
                  key={tpl.tag}
                  data-ocid="chat.template.button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSuggestion(tpl.prompt)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border bg-secondary/50 hover:border-primary/40 hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all"
                >
                  {tpl.tag}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="w-full max-w-2xl mt-6 px-2">
          <ChatInput
            input={input}
            setInput={setInput}
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            textareaRef={textareaRef}
            disabled={true}
            placeholder={t(
              "Select or create a new chat to start building...",
              "নতুন চ্যাট তৈরি করুন...",
            )}
            systemPrompt={systemPrompt}
            language={language}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 md:px-6 py-3.5 border-b border-border bg-card/50 backdrop-blur-sm min-h-[52px] flex-shrink-0">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
        <h2 className="font-display font-semibold text-foreground text-[14px] md:text-[15px] tracking-tight truncate flex-1">
          {session.title}
        </h2>
        <span className="text-xs text-muted-foreground/50 flex-shrink-0">
          {messages.length} {t("msg", "বার্তা")}
        </span>
        {onTogglePreview && (
          <Button
            data-ocid="chat.preview.toggle"
            variant="ghost"
            size="sm"
            onClick={onTogglePreview}
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground hidden md:flex"
          >
            {showPreview ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                {t("Hide Preview", "প্রিভিউ বন্ধ")}
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                {t("Preview", "প্রিভিউ")}
              </>
            )}
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 scrollbar-thin">
        <div className="px-3 md:px-4 py-6 space-y-6 max-w-3xl mx-auto">
          {isLoadingMessages ? (
            <div data-ocid="chat.loading_state" className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-muted animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <p className="text-muted-foreground text-sm">
                {t(
                  "Send your first message to start building...",
                  "প্রথম বার্তা পাঠান...",
                )}
              </p>
            </motion.div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id.toString()}
                  data-ocid={`chat.message.item.${index + 1}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2 md:gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      message.role === "user"
                        ? "bg-secondary border border-border"
                        : "bg-primary/10 border border-primary/25"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    )}
                  </div>

                  <div
                    className={`max-w-[85%] md:max-w-[78%] rounded-2xl px-3 md:px-4 py-3 text-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-card border border-border text-foreground rounded-tl-sm"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <MessageContent content={message.content} />
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          <AnimatePresence>
            {isAITyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="flex gap-3"
              >
                <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-1 h-4">
                    <span className="typing-dot w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="typing-dot w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="typing-dot w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="px-3 md:px-4 pb-3 md:pb-4 pt-2 max-w-3xl mx-auto w-full">
        <ChatInput
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          textareaRef={textareaRef}
          disabled={isSending || isAITyping}
          placeholder={t(
            "Describe what you want to build... (Shift+Enter for newline)",
            "আপনি কী তৈরি করতে চান বর্ণনা করুন... (Shift+Enter নতুন লাইন)",
          )}
          systemPrompt={systemPrompt}
          language={language}
        />
        <p className="text-center text-[10px] text-muted-foreground/40 mt-2">
          {t(
            "Caffeine AI may produce inaccurate code. Always review before deploying.",
            "Caffeine AI ভুল কোড তৈরি করতে পারে। ডিপ্লয় করার আগে সর্বদা পর্যালোচনা করুন।",
          )}
        </p>
      </div>
    </div>
  );
}
