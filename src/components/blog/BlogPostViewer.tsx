import React from 'react';
import ReactMarkdown from 'react-markdown';

interface BlogPostViewerProps {
    content: string | null;
    loading: boolean;
    error: string | null;
}

const BlogPostViewer: React.FC<BlogPostViewerProps> = ({ content, loading, error }) => {
    const inner = () => {
        if (loading) return <p style={styles.status}>Loading...</p>;
        if (error) return <p style={styles.status}>{error}</p>;
        if (!content) return <p style={styles.status}>Select a post from the list.</p>;
        return <ReactMarkdown>{content}</ReactMarkdown>;
    };

    return <div style={styles.viewer}>{inner()}</div>;
};

const styles: StyleSheetCSS = {
    viewer: {
        flex: 1,
        height: '100%',
        overflowY: 'auto',
        padding: 16,
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        fontSize: 13,
        lineHeight: 1.6,
        boxSizing: 'border-box',
    },
    status: {
        color: '#555',
        fontSize: 12,
        marginTop: 8,
    },
};

export default BlogPostViewer;
