import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

interface BlogPostViewerProps {
    content: string | null;
    loading: boolean;
    error: string | null;
}

const md: Components = {
    h1: ({ children }) => <div style={mdStyles.h1}>{children}</div>,
    h2: ({ children }) => <div style={mdStyles.h2}>{children}</div>,
    h3: ({ children }) => <div style={mdStyles.h3}>{children}</div>,
    p:  ({ children }) => <div style={mdStyles.p}>{children}</div>,
    ul: ({ children }) => <div style={mdStyles.ul}>{children}</div>,
    ol: ({ children }) => <div style={mdStyles.ol}>{children}</div>,
    li: ({ children }) => <div style={mdStyles.li}>• {children}</div>,
    a:  ({ href, children }) => <a href={href} style={mdStyles.a} target="_blank" rel="noreferrer">{children}</a>,
    code: ({ children }) => <code style={mdStyles.inlineCode}>{children}</code>,
    pre: ({ children }) => <div style={mdStyles.pre}>{children}</div>,
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
    p:  { ...base, fontSize: 15, marginBottom: 10 },
    ul: { flexDirection: 'column', marginBottom: 10, paddingLeft: 0 },
    ol: { flexDirection: 'column', marginBottom: 10, paddingLeft: 0 },
    li: { ...base, fontSize: 15, marginBottom: 4 },
    a:  { ...base, fontSize: 15, color: '#0000cc' },
    inlineCode: {
        fontFamily: 'Courier New, monospace',
        fontSize: 14,
        backgroundColor: '#f0f0f0',
        padding: '1px 4px',
        borderRadius: 2,
    },
    pre: {
        flexDirection: 'column',
        fontFamily: 'Courier New, monospace',
        fontSize: 14,
        backgroundColor: '#f0f0f0',
        padding: 12,
        marginBottom: 10,
        overflowX: 'auto',
        whiteSpace: 'pre',
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
