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
