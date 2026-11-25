"use client";

import { useState, type ReactNode } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import { Markdown } from "tiptap-markdown";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List as ListIcon,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
  Unlink,
} from "lucide-react";

import { cn } from "@/lib/utils";

const EDITOR_CLASS = [
  "tiptap min-h-96 px-4 py-4 text-[15px] leading-7 text-ink/80 outline-none",
  "[&>*:first-child]:mt-0",
  "[&_p]:mt-4",
  "[&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-[26px] [&_h2]:leading-tight [&_h2]:text-ink",
  "[&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:font-display [&_h3]:text-xl [&_h3]:text-ink",
  "[&_a]:font-medium [&_a]:text-teal [&_a]:underline [&_a]:underline-offset-2",
  "[&_strong]:font-semibold [&_strong]:text-ink",
  "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6",
  "[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6",
  "[&_li]:pl-1",
  "[&_blockquote]:mt-6 [&_blockquote]:border-l-2 [&_blockquote]:border-gold [&_blockquote]:pl-4 [&_blockquote]:text-[14.5px] [&_blockquote]:text-muted [&_blockquote]:italic",
  "[&_hr]:mt-10 [&_hr]:border-line",
  "[&_code]:rounded [&_code]:bg-sand [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[13px]",
  "[&_pre]:mt-6 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-deep [&_pre]:p-4 [&_pre]:text-[13px] [&_pre]:text-cream",
].join(" ");

type MarkdownStorage = {
  markdown: {
    getMarkdown: () => string;
  };
};

function normalizeUrl(value: string): string {
  const url = value.trim();
  if (!url) return "";

  return /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(url) ? url : `https://${url}`;
}

export function RichTextEditor({
  initialContent,
  onChange,
}: {
  initialContent: string;
  onChange: (markdown: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        underline: false,
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: {
            rel: "noopener noreferrer",
            target: "_blank",
          },
        },
      }),
      Placeholder.configure({
        placeholder: "Escribe el artículo aquí y dale formato con la barra de arriba.",
      }),
      Markdown.configure({
        html: false,
        tightLists: true,
        bulletListMarker: "-",
        linkify: true,
        breaks: false,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: EDITOR_CLASS,
        "aria-label": "Contenido del artículo",
      },
    },
    onUpdate: ({ editor }) => {
      const storage = editor.storage as unknown as MarkdownStorage;
      onChange(storage.markdown.getMarkdown());
    },
  });

  if (!editor) {
    return (
      <div className="min-h-96 animate-pulse rounded-xl border border-line bg-sand" />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white transition focus-within:border-teal focus-within:ring-4 focus-within:ring-teal/10">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function EditorToolbar({ editor }: { editor: Editor }) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      h2: editor.isActive("heading", { level: 2 }),
      h3: editor.isActive("heading", { level: 3 }),
      bulletList: editor.isActive("bulletList"),
      orderedList: editor.isActive("orderedList"),
      blockquote: editor.isActive("blockquote"),
      link: editor.isActive("link"),
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
    }),
  });

  function openLink() {
    setLinkUrl(editor.getAttributes("link").href ?? "https://");
    setLinkOpen(true);
  }

  function applyLink() {
    const href = normalizeUrl(linkUrl);
    if (href) {
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }

    setLinkOpen(false);
  }

  function removeLink() {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkOpen(false);
  }

  return (
    <div className="border-b border-line bg-sand">
      <div className="flex flex-wrap items-center gap-1 px-2 py-1.5">
        <ToolButton
          label="Negrita"
          active={state?.bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="size-4" aria-hidden="true" />
        </ToolButton>
        <ToolButton
          label="Cursiva"
          active={state?.italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-4" aria-hidden="true" />
        </ToolButton>

        <Separator />

        <ToolButton
          label="Subtítulo"
          active={state?.h2}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="size-4" aria-hidden="true" />
        </ToolButton>
        <ToolButton
          label="Subtítulo pequeño"
          active={state?.h3}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="size-4" aria-hidden="true" />
        </ToolButton>

        <Separator />

        <ToolButton
          label="Lista con viñetas"
          active={state?.bulletList}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <ListIcon className="size-4" aria-hidden="true" />
        </ToolButton>
        <ToolButton
          label="Lista numerada"
          active={state?.orderedList}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="size-4" aria-hidden="true" />
        </ToolButton>
        <ToolButton
          label="Cita"
          active={state?.blockquote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="size-4" aria-hidden="true" />
        </ToolButton>

        <Separator />

        <ToolButton
          label="Enlace"
          active={state?.link}
          onClick={openLink}
        >
          <Link2 className="size-4" aria-hidden="true" />
        </ToolButton>

        <div className="ml-auto flex items-center gap-1">
          <ToolButton
            label="Deshacer"
            disabled={!state?.canUndo}
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo2 className="size-4" aria-hidden="true" />
          </ToolButton>
          <ToolButton
            label="Rehacer"
            disabled={!state?.canRedo}
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo2 className="size-4" aria-hidden="true" />
          </ToolButton>
        </div>
      </div>

      {linkOpen && (
        <div className="flex flex-wrap items-center gap-2 border-t border-line bg-white px-2.5 py-2">
          <label htmlFor="link-url" className="sr-only">
            URL del enlace
          </label>
          <input
            id="link-url"
            autoFocus
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                applyLink();
              }

              if (event.key === "Escape") {
                setLinkOpen(false);
                editor.chain().focus().run();
              }
            }}
            placeholder="https://ejemplo.com"
            className="field h-9 flex-1 text-[12.5px]"
          />
          <button
            type="button"
            onClick={applyLink}
            className="inline-flex h-9 items-center rounded-full bg-deep px-3.5 text-[12px] font-semibold text-cream transition-colors hover:bg-deep-800"
          >
            Aplicar
          </button>
          <button
            type="button"
            onClick={removeLink}
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[12px] font-semibold text-muted transition-colors hover:bg-sand hover:text-ink"
          >
            <Unlink className="size-3.5" aria-hidden="true" />
            Quitar
          </button>
        </div>
      )}
    </div>
  );
}

function Separator() {
  return <span className="mx-1 h-5 w-px bg-line" aria-hidden="true" />;
}

function ToolButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-lg transition-colors",
        active
          ? "bg-white text-ink shadow-sm"
          : "text-ink/65 hover:bg-white/70 hover:text-ink",
        disabled && "cursor-not-allowed opacity-35 hover:bg-transparent",
      )}
    >
      {children}
    </button>
  );
}
