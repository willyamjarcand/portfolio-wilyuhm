# Blog Explorer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a "Blog" desktop icon that opens a Win95-style window with a Finder-like two-pane file browser — year/month tree on the left, rendered markdown on the right.

**Architecture:** Posts are stored as `.md` files under `public/blog/{year}/{month}/{slug}.md`. A static `public/blog/index.json` manifest is fetched on window open to build the tree. Clicking a post fetches the raw MD and renders it via `react-markdown`. The `BlogExplorer` window app owns all fetch state; `BlogFileTree` and `BlogPostViewer` are pure presentational components.

**Tech Stack:** React 18, TypeScript 5, Vite 6, `react-markdown` (new dep), inline styles (`StyleSheetCSS`)

---

### Task 1: Add `react-markdown` dependency

**Files:**
- Modify: `package.json` (via npm install)

**Step 1: Install**

```bash
npm install react-markdown
```

**Step 2: Verify type-check still passes**

```bash
npx tsc --noEmit
```

Expected: no errors

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add react-markdown dependency"
```

---

### Task 2: Add blog icon asset

**Files:**
- Create: `src/assets/icons/blogIcon.png`
- Modify: `src/assets/icons/index.ts`

**Step 1: Add a placeholder icon**

Drop a Win95-style folder/notepad PNG at `src/assets/icons/blogIcon.png`.
You can use any existing 32×32 icon as a placeholder for now and swap it later.

**Step 2: Register it in `src/assets/icons/index.ts`**

Add at the top (imports):
```ts
import blogIcon from './blogIcon.png';
```

Add to the `icons` object:
```ts
blogIcon: blogIcon,
```

**Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors. `IconName` now includes `'blogIcon'`.

**Step 4: Commit**

```bash
git add src/assets/icons/blogIcon.png src/assets/icons/index.ts
git commit -m "feat: add blogIcon asset"
```

---

### Task 3: Create the manifest and a sample post

**Files:**
- Create: `public/blog/index.json`
- Create: `public/blog/2026/02/hello-world.md`

**Step 1: Create the manifest**

`public/blog/index.json`:
```json
[
  {
    "year": "2026",
    "month": "02",
    "slug": "hello-world",
    "title": "Hello World",
    "topic": "general"
  }
]
```

**Step 2: Create the sample post**

`public/blog/2026/02/hello-world.md`:
```md
# Hello World

This is my first blog post.

## A section

Some content here.
```

**Step 3: Commit**

```bash
git add public/blog/
git commit -m "content: add blog manifest and sample post"
```

---

### Task 4: Create `BlogFileTree` component

**Files:**
- Create: `src/components/blog/BlogFileTree.tsx`

**Step 1: Define the `PostMeta` type and write the component**

`src/components/blog/BlogFileTree.tsx`:
```tsx
import React, { useState } from 'react';

export interface PostMeta {
    year: string;
    month: string;
    slug: string;
    title: string;
    topic: string;
}

interface BlogFileTreeProps {
    manifest: PostMeta[];
    selected: PostMeta | null;
    onSelect: (post: PostMeta) => void;
}

const MONTH_NAMES: Record<string, string> = {
    '01': 'January', '02': 'February', '03': 'March', '04': 'April',
    '05': 'May', '06': 'June', '07': 'July', '08': 'August',
    '09': 'September', '10': 'October', '11': 'November', '12': 'December',
};

const BlogFileTree: React.FC<BlogFileTreeProps> = ({ manifest, selected, onSelect }) => {
    // Group: { [year]: { [month]: PostMeta[] } }
    const tree = manifest.reduce<Record<string, Record<string, PostMeta[]>>>((acc, post) => {
        if (!acc[post.year]) acc[post.year] = {};
        if (!acc[post.year][post.month]) acc[post.year][post.month] = [];
        acc[post.year][post.month].push(post);
        return acc;
    }, {});

    const years = Object.keys(tree).sort((a, b) => Number(b) - Number(a));

    const [collapsedYears, setCollapsedYears] = useState<Record<string, boolean>>({});
    const [collapsedMonths, setCollapsedMonths] = useState<Record<string, boolean>>({});

    const toggleYear = (year: string) =>
        setCollapsedYears((prev) => ({ ...prev, [year]: !prev[year] }));

    const toggleMonth = (key: string) =>
        setCollapsedMonths((prev) => ({ ...prev, [key]: !prev[key] }));

    return (
        <div style={styles.tree}>
            {years.map((year) => (
                <div key={year}>
                    <div style={styles.yearRow} onClick={() => toggleYear(year)}>
                        <span style={styles.arrow}>{collapsedYears[year] ? '▶' : '▼'}</span>
                        <span style={styles.yearLabel}>{year}</span>
                    </div>
                    {!collapsedYears[year] &&
                        Object.keys(tree[year])
                            .sort((a, b) => Number(b) - Number(a))
                            .map((month) => {
                                const monthKey = `${year}-${month}`;
                                return (
                                    <div key={monthKey} style={styles.monthBlock}>
                                        <div
                                            style={styles.monthRow}
                                            onClick={() => toggleMonth(monthKey)}
                                        >
                                            <span style={styles.arrow}>
                                                {collapsedMonths[monthKey] ? '▶' : '▼'}
                                            </span>
                                            <span style={styles.monthLabel}>
                                                {MONTH_NAMES[month] ?? month}
                                            </span>
                                        </div>
                                        {!collapsedMonths[monthKey] &&
                                            tree[year][month].map((post) => {
                                                const isSelected =
                                                    selected?.slug === post.slug &&
                                                    selected?.year === post.year &&
                                                    selected?.month === post.month;
                                                return (
                                                    <div
                                                        key={post.slug}
                                                        style={Object.assign(
                                                            {},
                                                            styles.postRow,
                                                            isSelected && styles.postRowSelected
                                                        )}
                                                        onClick={() => onSelect(post)}
                                                    >
                                                        {post.title}
                                                    </div>
                                                );
                                            })}
                                    </div>
                                );
                            })}
                </div>
            ))}
        </div>
    );
};

const styles: StyleSheetCSS = {
    tree: {
        width: 220,
        minWidth: 220,
        height: '100%',
        borderRight: '1px solid #808080',
        overflowY: 'auto',
        backgroundColor: '#ffffff',
        padding: 4,
        boxSizing: 'border-box',
        fontFamily: 'Arial, sans-serif',
        fontSize: 12,
    },
    yearRow: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        padding: '2px 4px',
        userSelect: 'none',
        fontWeight: 'bold',
    },
    monthBlock: {
        paddingLeft: 12,
    },
    monthRow: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        padding: '2px 4px',
        userSelect: 'none',
    },
    arrow: {
        fontSize: 8,
        marginRight: 4,
        color: '#555',
    },
    yearLabel: {
        fontSize: 12,
    },
    monthLabel: {
        fontSize: 12,
    },
    postRow: {
        paddingLeft: 20,
        padding: '3px 4px 3px 20px',
        cursor: 'pointer',
        fontSize: 12,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    postRowSelected: {
        backgroundColor: '#000080',
        color: '#ffffff',
    },
};

export default BlogFileTree;
```

**Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

**Step 3: Commit**

```bash
git add src/components/blog/BlogFileTree.tsx
git commit -m "feat: add BlogFileTree component"
```

---

### Task 5: Create `BlogPostViewer` component

**Files:**
- Create: `src/components/blog/BlogPostViewer.tsx`

**Step 1: Write the component**

`src/components/blog/BlogPostViewer.tsx`:
```tsx
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
```

**Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

**Step 3: Commit**

```bash
git add src/components/blog/BlogPostViewer.tsx
git commit -m "feat: add BlogPostViewer component"
```

---

### Task 6: Create `BlogExplorer` window app

**Files:**
- Create: `src/components/applications/BlogExplorer.tsx`

**Step 1: Write the component**

`src/components/applications/BlogExplorer.tsx`:
```tsx
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
```

**Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

**Step 3: Commit**

```bash
git add src/components/applications/BlogExplorer.tsx
git commit -m "feat: add BlogExplorer window app"
```

---

### Task 7: Register Blog in Desktop

**Files:**
- Modify: `src/components/os/Desktop.tsx`

**Step 1: Add the import at the top of `Desktop.tsx`**

```ts
import BlogExplorer from '../applications/BlogExplorer';
```

**Step 2: Add entry to `APPLICATIONS` (after `credits`):**

```ts
blog: {
    key: 'blog',
    name: 'Blog',
    shortcutIcon: 'blogIcon',
    component: BlogExplorer,
},
```

**Step 3: Type-check and verify in browser**

```bash
npx tsc --noEmit
npm run dev
```

Open the app, double-click the Blog icon, verify:
- Tree shows `2026 > February > Hello World`
- Clicking the post renders the markdown

**Step 4: Commit**

```bash
git add src/components/os/Desktop.tsx
git commit -m "feat: register Blog app on desktop"
```
