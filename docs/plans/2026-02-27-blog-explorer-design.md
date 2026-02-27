# Blog Explorer — Design Doc
**Date:** 2026-02-27

## Summary

Add a "Blog" desktop icon that opens a Win95-style window showing a Finder-like two-pane file browser. The left pane is a collapsible tree organized by year → month → post. Clicking a post fetches and renders the markdown in the right pane via `react-markdown`.

---

## Architecture

### New files

```
public/
  blog/
    index.json              ← manifest listing all posts
    2025/01/my-post.md      ← actual post content

src/components/applications/
  BlogExplorer.tsx          ← window app, registered in Desktop.tsx

src/components/blog/
  BlogFileTree.tsx          ← left pane: collapsible year/month/file tree
  BlogPostViewer.tsx        ← right pane: renders fetched MD with react-markdown

src/assets/icons/
  blogIcon.png              ← Win95-style icon for desktop shortcut + window bar
```

### Modified files

- `src/assets/icons/index.ts` — add `blogIcon`
- `src/components/os/Desktop.tsx` — register `blog` in `APPLICATIONS`

---

## Data

### `public/blog/index.json`

```json
[
  {
    "year": "2025",
    "month": "01",
    "slug": "my-first-post",
    "title": "My First Post",
    "topic": "engineering"
  }
]
```

- `topic` is stored for future filtering/grouping but not surfaced in the UI yet.
- File path is derived as `public/blog/{year}/{month}/{slug}.md`.

---

## Data Flow

1. `BlogExplorer` mounts → `fetch('/blog/index.json')` → groups posts by `year → month`
2. `BlogFileTree` renders the grouped tree; year/month nodes are collapsible
3. User clicks a post → `BlogExplorer` `fetch('/blog/{year}/{month}/{slug}.md')` → raw text
4. `BlogPostViewer` receives raw text → renders via `react-markdown`
5. Loading/error states shown inline in the right pane

---

## Components

### `BlogExplorer` (application window)
- Owns fetch state: `manifest`, `selectedPost`, `postContent`, `loading`, `error`
- Renders `<Window>` containing a horizontal split: `BlogFileTree` (left, fixed ~220px) + `BlogPostViewer` (right, flex)

### `BlogFileTree`
- Props: `manifest: PostMeta[]`, `selected: PostMeta | null`, `onSelect: (post: PostMeta) => void`
- Groups by year → month, renders collapsible rows in Win95 list style
- Selected item highlighted

### `BlogPostViewer`
- Props: `content: string | null`, `loading: boolean`, `error: string | null`
- Renders `react-markdown` output or loading/error text
- Scrollable

---

## Dependencies

- `react-markdown` — new dep, ~12kb gzipped

---

## Out of Scope (future)

- Filter/group by topic
- Search
- Pagination
