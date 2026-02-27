import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import mermaid from 'mermaid';

let mermaidReady = false;

const MermaidBlock: React.FC<{ chart: string }> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mermaidReady) {
      mermaid.initialize({ startOnLoad: false, theme: 'default' });
      mermaidReady = true;
    }

    // Fresh id per effect run — prevents StrictMode double-invoke from
    // hitting a duplicate id in the DOM (mermaid looks up by id).
    const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    let cancelled = false;

    if (ref.current) ref.current.innerHTML = '';

    mermaid.render(id, chart).then(({ svg }) => {
      if (!cancelled && ref.current) {
        ref.current.innerHTML = svg;
        const svgEl = ref.current.querySelector('svg');
        if (svgEl) {
          svgEl.style.width = '100%';
          svgEl.style.maxWidth = '100%';
          svgEl.style.height = 'auto';
        }
      }
    }).catch(console.error);

    return () => {
      cancelled = true;
      document.getElementById(`d${id}`)?.remove();
      if (ref.current) ref.current.innerHTML = '';
    };
  }, [chart]);

  return <div ref={ref} style={{ width: '50%', marginBottom: 12 }} />;
};

interface BlogPostViewerProps {
  content: string | null;
  loading: boolean;
  error: string | null;
}

const md: Components = {
  h1: ({ children }) => <div style={mdStyles.h1}>{children}</div>,
  h2: ({ children }) => <div style={mdStyles.h2}>{children}</div>,
  h3: ({ children }) => <div style={mdStyles.h3}>{children}</div>,
  p: ({ children }) => <div style={mdStyles.p}>{children}</div>,
  ul: ({ children }) => <div style={mdStyles.ul}>{children}</div>,
  ol: ({ children }) => <div style={mdStyles.ol}>{children}</div>,
  li: ({ children }) => <div style={mdStyles.li}>• {children}</div>,
  a: ({ href, children }) => <a href={href} style={mdStyles.a} target="_blank" rel="noreferrer">{children}</a>,
  code: ({ className, children }) => {
    const lang = /language-(\w+)/.exec(className || '')?.[1];
    if (lang === 'mermaid') {
      return <MermaidBlock chart={String(children).replace(/\n$/, '')} />;
    }
    return <code style={mdStyles.inlineCode}>{children}</code>;
  },
  pre: ({ children }) => {
    const child = React.isValidElement(children)
      ? (children as React.ReactElement<{ className?: string }>)
      : null;
    if (child?.props?.className?.includes('language-mermaid')) {
      return <>{children}</>;
    }
    const block = child ? React.cloneElement(child, { style: mdStyles.blockCode } as any) : children;
    return <div style={mdStyles.pre}>{block}</div>;
  },
  blockquote: ({ children }) => <div style={mdStyles.blockquote}>{children}</div>,
};

const BlogPostViewer: React.FC<BlogPostViewerProps> = ({ content, loading, error }) => {
  const inner = () => {
    if (loading) return <div style={styles.status}>Loading...</div>;
    if (error) return <div style={styles.status}>{error}</div>;
    if (!content) return <div style={styles.status}>Select a post from the list.</div>;
    return <ReactMarkdown components={md}>{content}</ReactMarkdown>;
  };

  return <div style={styles.viewer}>{inner()}</div>;
};

const base = {
  fontFamily: 'Arial, sans-serif',
  color: '#000000',
  lineHeight: 1.6,
};

const mdStyles: StyleSheetCSS = {
  h1: { ...base, fontSize: 26, fontWeight: 'bold', marginBottom: 12, marginTop: 8 },
  h2: { ...base, fontSize: 20, fontWeight: 'bold', marginBottom: 8, marginTop: 16 },
  h3: { ...base, fontSize: 17, fontWeight: 'bold', marginBottom: 6, marginTop: 12 },
  p: { ...base, display: 'block', fontSize: 15, marginBottom: 10 },
  ul: { flexDirection: 'column', marginBottom: 10, paddingLeft: 0 },
  ol: { flexDirection: 'column', marginBottom: 10, paddingLeft: 0 },
  li: { ...base, display: 'block', fontSize: 15, marginBottom: 4 },
  a: { ...base, fontSize: 15, color: '#0000cc' },
  inlineCode: {
    fontFamily: 'Courier New, monospace',
    fontSize: 14,
    backgroundColor: '#f0f0f0',
    padding: '1px 4px',
    borderRadius: 2,
  },
  blockCode: {
    display: 'block',
    fontFamily: 'Courier New, monospace',
    fontSize: 14,
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
  },
  pre: {
    flexDirection: 'column',
    fontFamily: 'Courier New, monospace',
    fontSize: 14,
    backgroundColor: '#f0f0f0',
    padding: 12,
    marginBottom: 10,
    whiteSpace: 'pre-wrap',
  },
  blockquote: {
    flexDirection: 'column',
    borderLeft: '3px solid #c0c0c0',
    paddingLeft: 12,
    marginBottom: 10,
    color: '#555',
  },
};

const styles: StyleSheetCSS = {
  viewer: {
    flexDirection: 'column',
    flex: 1,
    height: '100%',
    overflowY: 'auto',
    padding: 20,
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
    alignItems: 'flex-start',
  },
  status: {
    fontFamily: 'Arial, sans-serif',
    color: '#555',
    fontSize: 12,
    marginTop: 8,
  },
};

export default BlogPostViewer;
