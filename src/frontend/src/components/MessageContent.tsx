import { CodeBlock } from "./CodeBlock";

interface MessageContentProps {
  content: string;
}

type Part = {
  type: "text" | "code";
  content: string;
  language?: string;
  key: string;
};

function formatTextContent(text: string): string {
  return text
    .split("\n")
    .map((line) => {
      const boldLine = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      return boldLine ? `<p class="mb-1">${boldLine}</p>` : "<br/>";
    })
    .join("");
}

function parseParts(content: string): Part[] {
  const parts: Part[] = [];
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let idx = 0;

  // biome-ignore lint/suspicious/noAssignInExpressions: iterating regex matches
  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: content.slice(lastIndex, match.index),
        key: `text-${idx++}`,
      });
    }
    parts.push({
      type: "code",
      language: match[1] || "plaintext",
      content: match[2].trim(),
      key: `code-${idx++}`,
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: "text",
      content: content.slice(lastIndex),
      key: `text-${idx++}`,
    });
  }

  return parts;
}

export function MessageContent({ content }: MessageContentProps) {
  const parts = parseParts(content);

  return (
    <div className="space-y-1">
      {parts.map((part) =>
        part.type === "code" ? (
          <CodeBlock
            key={part.key}
            language={part.language || ""}
            code={part.content}
          />
        ) : (
          <div
            key={part.key}
            className="leading-relaxed"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: safe bold-only formatting
            dangerouslySetInnerHTML={{
              __html: formatTextContent(part.content),
            }}
          />
        ),
      )}
    </div>
  );
}
