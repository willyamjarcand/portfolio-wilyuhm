import React, { useEffect, useRef, useState } from 'react';
import BlogFileTree, { PostMeta } from '../blog/BlogFileTree';
import BlogPostViewer from '../blog/BlogPostViewer';

const Blog: React.FC = () => {
    const [manifest, setManifest] = useState<PostMeta[]>([]);
    const [selected, setSelected] = useState<PostMeta | null>(null);
    const [postContent, setPostContent] = useState<string | null>(null);
    const [postLoading, setPostLoading] = useState(false);
    const [postError, setPostError] = useState<string | null>(null);
    const currentSlug = useRef<string | null>(null);

    useEffect(() => {
        fetch('/blog/index.json')
            .then((r) => {
                if (!r.ok) throw new Error('Failed to load blog index');
                return r.json();
            })
            .then((data: PostMeta[]) => setManifest(data))
            .catch(() => {});
    }, []);

    const handleSelect = (post: PostMeta) => {
        const key = `${post.year}/${post.month}/${post.slug}`;
        currentSlug.current = key;
        setSelected(post);
        setPostContent(null);
        setPostError(null);
        setPostLoading(true);
        fetch(`/blog/${key}.md`)
            .then((r) => {
                if (!r.ok) throw new Error('Failed to load post');
                return r.text();
            })
            .then((text) => {
                if (currentSlug.current === key) setPostContent(text);
            })
            .catch((e) => {
                if (currentSlug.current === key) setPostError(e.message);
            })
            .finally(() => {
                if (currentSlug.current === key) setPostLoading(false);
            });
    };

    return (
        <div style={styles.page}>
            <BlogFileTree
                manifest={manifest}
                selected={selected}
                onSelect={handleSelect}
            />
            <BlogPostViewer
                content={postContent}
                loading={postLoading}
                error={postError}
            />
        </div>
    );
};

const styles: StyleSheetCSS = {
    page: {
        flexDirection: 'row',
        marginLeft: 300,
        height: '100%',
        overflow: 'hidden',
    },
};

export default Blog;
