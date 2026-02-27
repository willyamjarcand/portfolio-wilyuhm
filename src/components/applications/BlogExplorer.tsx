import React, { useEffect, useState } from 'react';
import Window from '../os/Window';
import BlogFileTree, { PostMeta } from '../blog/BlogFileTree';
import BlogPostViewer from '../blog/BlogPostViewer';
import useInitialWindowSize from '../../hooks/useInitialWindowSize';

export interface BlogExplorerProps extends WindowAppProps {}

const BlogExplorer: React.FC<BlogExplorerProps> = (props) => {
    const { initWidth, initHeight } = useInitialWindowSize({ margin: 100 });

    const [manifest, setManifest] = useState<PostMeta[]>([]);
    const [manifestError, setManifestError] = useState<string | null>(null);

    const [selected, setSelected] = useState<PostMeta | null>(null);
    const [postContent, setPostContent] = useState<string | null>(null);
    const [postLoading, setPostLoading] = useState(false);
    const [postError, setPostError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/blog/index.json')
            .then((r) => {
                if (!r.ok) throw new Error('Failed to load blog index');
                return r.json();
            })
            .then((data: PostMeta[]) => setManifest(data))
            .catch((e) => setManifestError(e.message));
    }, []);

    const handleSelect = (post: PostMeta) => {
        setSelected(post);
        setPostContent(null);
        setPostError(null);
        setPostLoading(true);
        fetch(`/blog/${post.year}/${post.month}/${post.slug}.md`)
            .then((r) => {
                if (!r.ok) throw new Error('Failed to load post');
                return r.text();
            })
            .then((text) => setPostContent(text))
            .catch((e) => setPostError(e.message))
            .finally(() => setPostLoading(false));
    };

    return (
        <Window
            top={24}
            left={56}
            width={initWidth}
            height={initHeight}
            windowTitle="Blog"
            windowBarIcon="blogIcon"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText={'wilyuhm.dev'}
        >
            <div style={styles.container}>
                {manifestError ? (
                    <p style={styles.manifestError}>{manifestError}</p>
                ) : (
                    <>
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
                    </>
                )}
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
    manifestError: {
        color: 'red',
        padding: 16,
        fontSize: 12,
    },
};

export default BlogExplorer;
