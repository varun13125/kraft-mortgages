"use client";
import ReactMarkdown from "react-markdown";

export default function ChatMessageContent({ content }: { content: string }) {
  return <div className="min-w-0 text-sm leading-relaxed break-words [&_p+p]:mt-3 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:mt-1 [&_a]:text-gold-300 [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-semibold [&_h1]:font-semibold [&_h2]:font-semibold [&_h3]:font-semibold [&_h4]:font-semibold [&_blockquote]:border-l [&_blockquote]:pl-3 [&_table]:text-xs [&_td]:p-1 [&_th]:p-1">
    <ReactMarkdown skipHtml allowedElements={["p", "strong", "em", "ul", "ol", "li", "a", "br", "code", "h1", "h2", "h3", "h4", "blockquote", "hr", "table", "thead", "tbody", "tr", "th", "td"]}
      components={{ a: ({ href, children }) => <a href={href} {...(href?.startsWith("https://") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{children}</a> }}>
      {content.replace(/https:\/\/(?:www\.)?kraftmortgages\.ca\/apply\b/g, "https://www.kraftmortgages.ca/qualify")}
    </ReactMarkdown>
  </div>;
}
