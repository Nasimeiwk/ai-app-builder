import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Eye, Monitor, X } from "lucide-react";
import { motion } from "motion/react";
import type { Message } from "../backend.d";

interface PreviewPanelProps {
  messages: Message[];
  onClose: () => void;
  className?: string;
}

function extractCode(
  messages: Message[],
): { language: string; code: string } | null {
  const lastAI = [...messages].reverse().find((m) => m.role === "assistant");
  if (!lastAI) return null;
  const match = lastAI.content.match(/```([\w+-]*)\n([\s\S]+?)```/);
  if (!match) return null;
  return { language: match[1] || "code", code: match[2].trim() };
}

export function PreviewPanel({
  messages,
  onClose,
  className = "",
}: PreviewPanelProps) {
  const extracted = extractCode(messages);
  const isHtml = extracted?.language?.toLowerCase() === "html";

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`flex flex-col bg-card border-l border-border overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border bg-sidebar min-h-[52px]">
        <Monitor className="w-4 h-4 text-primary" />
        <span className="font-display font-semibold text-foreground text-sm tracking-tight">
          Preview
        </span>
        {extracted && (
          <Badge
            variant="outline"
            className="ml-1 text-[10px] border-primary/30 text-primary bg-primary/5 font-mono-code uppercase tracking-wide"
          >
            {extracted.language}
          </Badge>
        )}
        <Button
          data-ocid="preview.close_button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="ml-auto h-7 w-7 p-0 hover:bg-secondary"
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="code"
        className="flex-1 flex flex-col overflow-hidden"
      >
        <TabsList className="mx-4 mt-3 mb-0 h-8 bg-secondary/60 w-fit">
          <TabsTrigger
            data-ocid="preview.code.tab"
            value="code"
            className="text-xs gap-1.5 data-[state=active]:bg-card"
          >
            <Code2 className="w-3 h-3" />
            Code
          </TabsTrigger>
          <TabsTrigger
            data-ocid="preview.preview.tab"
            value="preview"
            className="text-xs gap-1.5 data-[state=active]:bg-card"
          >
            <Eye className="w-3 h-3" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="code"
          className="flex-1 mt-3 overflow-hidden px-4 pb-4"
        >
          {extracted ? (
            <ScrollArea className="h-full rounded-lg scrollbar-thin">
              <div className="code-block">
                <div className="code-header">
                  <span className="font-mono-code text-xs text-muted-foreground/70 font-medium tracking-wide uppercase">
                    {extracted.language || "code"}
                  </span>
                </div>
                <pre className="p-4 overflow-x-auto scrollbar-thin">
                  <code className="font-mono-code text-[0.78rem] leading-relaxed text-slate-200">
                    {extracted.code}
                  </code>
                </pre>
              </div>
            </ScrollArea>
          ) : (
            <div
              data-ocid="preview.empty_state"
              className="h-full flex flex-col items-center justify-center gap-3 text-center"
            >
              <Code2 className="w-10 h-10 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground/50">
                No code generated yet.
                <br />
                Ask AI to build something!
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="preview"
          className="flex-1 mt-3 overflow-hidden px-4 pb-4"
        >
          {extracted && isHtml ? (
            <iframe
              title="HTML Preview"
              sandbox="allow-scripts"
              className="w-full h-full rounded-lg border border-border bg-white"
              srcDoc={extracted.code}
            />
          ) : (
            <div
              data-ocid="preview.empty_state"
              className="h-full flex flex-col items-center justify-center gap-3 text-center"
            >
              <Eye className="w-10 h-10 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground/50">
                {extracted
                  ? `Live preview available for HTML apps only.\nDetected: ${extracted.language}`
                  : "Preview will appear here once AI generates HTML code."}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
