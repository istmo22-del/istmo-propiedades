"use client";

import type { ReactNode, RefObject } from "react";
import {
  Bold,
  Heading2,
  Italic,
  Link2,
  List as ListIcon,
  ListOrdered,
  Quote,
} from "lucide-react";

type Format = "bold" | "italic" | "h2" | "bullet" | "number" | "quote" | "link";

type EditResult = {
  value: string;
  start: number;
  end: number;
};

function wrapInline(
  value: string,
  start: number,
  end: number,
  before: string,
  after: string,
  placeholder: string,
): EditResult {
  const selected = value.slice(start, end) || placeholder;
  const next = value.slice(0, start) + before + selected + after + value.slice(end);

  return {
    value: next,
    start: start + before.length,
    end: start + before.length + selected.length,
  };
}

function mapLines(
  value: string,
  start: number,
  end: number,
  transform: (lines: string[]) => string[],
): EditResult {
  const lineStart = start === 0 ? 0 : value.lastIndexOf("\n", start - 1) + 1;
  const nextBreak = value.indexOf("\n", end);
  const lineEnd = nextBreak === -1 ? value.length : nextBreak;
  const block = transform(value.slice(lineStart, lineEnd).split("\n")).join("\n");

  return {
    value: value.slice(0, lineStart) + block + value.slice(lineEnd),
    start: lineStart,
    end: lineStart + block.length,
  };
}

function togglePrefix(lines: string[], prefix: string): string[] {
  const all = lines.every((line) => line.trimStart().startsWith(prefix));

  return lines.map((line) => {
    if (!line.trim()) return line;

    if (all) {
      const at = line.indexOf(prefix);
      return line.slice(0, at) + line.slice(at + prefix.length);
    }

    return line.trimStart().startsWith(prefix) ? line : prefix + line;
  });
}

function toggleNumbered(lines: string[]): string[] {
  const all = lines.every((line) => /^\s*\d+\.\s/.test(line));
  let count = 0;

  return lines.map((line) => {
    if (!line.trim()) return line;

    if (all) return line.replace(/^(\s*)\d+\.\s/, "$1");

    count += 1;
    return `${count}. ${line.replace(/^\s*\d+\.\s/, "")}`;
  });
}

function insertLink(value: string, start: number, end: number): EditResult {
  const selected = value.slice(start, end);

  if (selected) {
    const next =
      value.slice(0, start) + `[${selected}](https://)` + value.slice(end);
    const urlStart = start + selected.length + 3;

    return { value: next, start: urlStart, end: urlStart + 8 };
  }

  const next = value.slice(0, start) + "[texto](https://)" + value.slice(end);

  return { value: next, start: start + 1, end: start + 6 };
}

function applyFormat(
  value: string,
  start: number,
  end: number,
  format: Format,
): EditResult {
  switch (format) {
    case "bold":
      return wrapInline(value, start, end, "**", "**", "texto");
    case "italic":
      return wrapInline(value, start, end, "_", "_", "texto");
    case "h2":
      return mapLines(value, start, end, (lines) => togglePrefix(lines, "## "));
    case "bullet":
      return mapLines(value, start, end, (lines) => togglePrefix(lines, "- "));
    case "number":
      return mapLines(value, start, end, toggleNumbered);
    case "quote":
      return mapLines(value, start, end, (lines) => togglePrefix(lines, "> "));
    case "link":
      return insertLink(value, start, end);
  }
}

export function MarkdownToolbar({
  textareaRef,
  value,
  onChange,
}: {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
}) {
  function handleFormat(format: Format) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;
    const result = applyFormat(value, selectionStart, selectionEnd, format);

    onChange(result.value);

    requestAnimationFrame(() => {
      const next = textareaRef.current;
      if (!next) return;

      next.focus();
      next.setSelectionRange(result.start, result.end);
    });
  }

  return (
    <div className="mb-2 flex flex-wrap items-center gap-1 rounded-xl border border-line bg-sand px-1.5 py-1">
      <ToolButton label="Negrita" onClick={() => handleFormat("bold")}>
        <Bold className="size-4" aria-hidden="true" />
      </ToolButton>
      <ToolButton label="Cursiva" onClick={() => handleFormat("italic")}>
        <Italic className="size-4" aria-hidden="true" />
      </ToolButton>
      <ToolButton label="Subtítulo" onClick={() => handleFormat("h2")}>
        <Heading2 className="size-4" aria-hidden="true" />
      </ToolButton>

      <span className="mx-1 h-5 w-px bg-line" aria-hidden="true" />

      <ToolButton label="Lista con viñetas" onClick={() => handleFormat("bullet")}>
        <ListIcon className="size-4" aria-hidden="true" />
      </ToolButton>
      <ToolButton label="Lista numerada" onClick={() => handleFormat("number")}>
        <ListOrdered className="size-4" aria-hidden="true" />
      </ToolButton>
      <ToolButton label="Cita" onClick={() => handleFormat("quote")}>
        <Quote className="size-4" aria-hidden="true" />
      </ToolButton>

      <span className="mx-1 h-5 w-px bg-line" aria-hidden="true" />

      <ToolButton label="Enlace" onClick={() => handleFormat("link")}>
        <Link2 className="size-4" aria-hidden="true" />
      </ToolButton>
    </div>
  );
}

function ToolButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex size-8 items-center justify-center rounded-lg text-ink/70 transition-colors hover:bg-white hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold"
    >
      {children}
    </button>
  );
}
