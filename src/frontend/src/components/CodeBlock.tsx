import { Check, Copy, Download } from "lucide-react";
import { useState } from "react";

interface CodeBlockProps {
  language: string;
  code: string;
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = getExtension(language);
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="code-block my-3 text-sm">
      <div className="code-header">
        <span className="font-mono-code text-xs text-muted-foreground/70 font-medium tracking-wide uppercase">
          {language || "code"}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-ocid="code.download_button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            title="Download code"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            data-ocid="code.copy_button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-primary" />
                <span className="text-primary">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
      <pre className="p-4 overflow-x-auto scrollbar-thin">
        <code className="font-mono-code text-[0.82rem] leading-relaxed text-slate-200">
          {code}
        </code>
      </pre>
    </div>
  );
}

function getExtension(lang: string): string {
  const map: Record<string, string> = {
    javascript: "js",
    js: "js",
    typescript: "ts",
    ts: "ts",
    python: "py",
    py: "py",
    html: "html",
    css: "css",
    json: "json",
    sql: "sql",
    bash: "sh",
    shell: "sh",
    sh: "sh",
    rust: "rs",
    go: "go",
    java: "java",
    cpp: "cpp",
    c: "c",
    ruby: "rb",
    php: "php",
    swift: "swift",
    kotlin: "kt",
    yaml: "yaml",
    yml: "yml",
    toml: "toml",
    motoko: "mo",
  };
  return map[lang.toLowerCase()] ?? "txt";
}
