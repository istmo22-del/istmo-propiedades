"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

/**
 * Render de Markdown sin HTML crudo (react-markdown lo bloquea por defecto),
 * por lo que no hay riesgo de XSS desde el contenido del artículo.
 * Se usa tanto en el artículo público como en la vista previa del panel.
 */
export function MarkdownContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "text-[15px] leading-7 text-ink/80",
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
        "[&_img]:mt-6 [&_img]:rounded-xl",
        "[&_hr]:mt-10 [&_hr]:border-line",
        "[&_code]:rounded [&_code]:bg-sand [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[13px]",
        "[&_table]:mt-6 [&_table]:w-full [&_table]:text-[13px]",
        "[&_th]:border-b [&_th]:border-line [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-ink",
        "[&_td]:border-b [&_td]:border-line [&_td]:py-2",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
