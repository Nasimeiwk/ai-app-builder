import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Settings } from "lucide-react";

export interface SettingsState {
  systemPrompt: string;
  language: "en" | "bn";
  model: string;
}

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: SettingsState;
  onSettingsChange: (settings: SettingsState) => void;
}

const MODELS = ["GPT-4o", "Claude 3.5 Sonnet", "Gemini Pro", "Llama 3"];

export function SettingsModal({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
}: SettingsModalProps) {
  const update = (partial: Partial<SettingsState>) => {
    const next = { ...settings, ...partial };
    onSettingsChange(next);
    if (partial.systemPrompt !== undefined)
      localStorage.setItem("systemPrompt", partial.systemPrompt);
    if (partial.language !== undefined)
      localStorage.setItem("language", partial.language);
    if (partial.model !== undefined)
      localStorage.setItem("model", partial.model);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-ocid="settings.dialog"
        className="sm:max-w-md bg-card border-border"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-foreground">
            <Settings className="w-4 h-4 text-primary" />
            {settings.language === "bn" ? "সেটিংস" : "Settings"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-1">
          {/* System Prompt */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              {settings.language === "bn" ? "সিস্টেম প্রম্পট" : "System Prompt"}
            </Label>
            <p className="text-[11px] text-muted-foreground/60">
              {settings.language === "bn"
                ? "এই নির্দেশনাগুলি প্রতিটি AI অনুরোধের আগে পাঠানো হয়।"
                : "These instructions are prepended to every AI request."}
            </p>
            <Textarea
              data-ocid="settings.textarea"
              value={settings.systemPrompt}
              onChange={(e) => update({ systemPrompt: e.target.value })}
              placeholder={
                settings.language === "bn"
                  ? "যেমন: সব উত্তর বাংলায় দাও। TypeScript ব্যবহার করো।"
                  : "e.g. Always use TypeScript. Include error handling."
              }
              className="resize-none text-sm bg-secondary/50 border-border focus-visible:ring-primary/30 min-h-[100px]"
              rows={4}
            />
          </div>

          {/* Language */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium text-foreground">
                {settings.language === "bn" ? "ভাষা" : "Language"}
              </Label>
              <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                Bengali / English
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs ${
                  settings.language === "en"
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                EN
              </span>
              <Switch
                data-ocid="settings.language.switch"
                checked={settings.language === "bn"}
                onCheckedChange={(checked) =>
                  update({ language: checked ? "bn" : "en" })
                }
                className="data-[state=checked]:bg-primary"
              />
              <span
                className={`text-xs ${
                  settings.language === "bn"
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                BN
              </span>
            </div>
          </div>

          {/* Model */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              {settings.language === "bn" ? "AI মডেল" : "AI Model"}
            </Label>
            <Select
              value={settings.model}
              onValueChange={(v) => update({ model: v })}
            >
              <SelectTrigger
                data-ocid="settings.model.select"
                className="bg-secondary/50 border-border text-sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {MODELS.map((m) => (
                  <SelectItem key={m} value={m} className="text-sm">
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            data-ocid="settings.close_button"
            onClick={() => onOpenChange(false)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {settings.language === "bn" ? "সংরক্ষণ করুন" : "Save & Close"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
