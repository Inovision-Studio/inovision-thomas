import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Safe Markdown → HTML for blog bodies. react-markdown never emits raw HTML
 * (no rehype-raw), and the element allow-list + URL filter below is the whole
 * sanitizer: scripts, iframes, javascript: links and off-site images can't
 * get through even if the source markdown contains them.
 */
const ALLOWED = ["h2", "h3", "p", "strong", "em", "a", "ul", "ol", "li", "blockquote", "img", "code", "pre", "br", "hr"];

function safeUrl(url: string, key: string): string {
  if (key === "src") {
    // images must be ours (site-relative), never a third-party host
    return url.startsWith("/api/img/") || (url.startsWith("/") && !url.startsWith("//")) ? url : "";
  }
  return /^(https?:|mailto:|tel:|\/(?!\/))/i.test(url) ? url : "";
}

export default function Markdown({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div className={`prose-site ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        allowedElements={ALLOWED}
        unwrapDisallowed
        skipHtml
        urlTransform={safeUrl}
        components={{
          a: ({ href, children }) => {
            const external = !!href && !href.startsWith("/");
            return (
              <a href={href || undefined} rel={external ? "noopener noreferrer" : undefined} target={external ? "_blank" : undefined}>
                {children}
              </a>
            );
          },
          img: ({ src, alt }) => (src ? <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} loading="lazy" /> : null),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
