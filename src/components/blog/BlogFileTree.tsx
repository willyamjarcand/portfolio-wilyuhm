import React, { useState } from 'react';
import directoryClosed from '../../assets/icons/directory_closed.png';
import directoryOpen from '../../assets/icons/directory_open_file_mydocs.png';
import fileIcon from '../../assets/icons/file.png';

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
    const [activeYear, setActiveYear] = useState<string | null>(null);
    const [activeMonth, setActiveMonth] = useState<string | null>(null);

    const tree = manifest.reduce<Record<string, Record<string, PostMeta[]>>>((acc, post) => {
        if (!acc[post.year]) acc[post.year] = {};
        if (!acc[post.year][post.month]) acc[post.year][post.month] = [];
        acc[post.year][post.month].push(post);
        return acc;
    }, {});

    const years = Object.keys(tree).sort((a, b) => Number(b) - Number(a));
    const months = activeYear
        ? Object.keys(tree[activeYear]).sort((a, b) => Number(b) - Number(a))
        : [];
    const posts =
        activeYear && activeMonth ? tree[activeYear][activeMonth] ?? [] : [];

    const handleYearClick = (year: string) => {
        setActiveYear(year);
        setActiveMonth(null);
    };

    const handleMonthClick = (month: string) => {
        setActiveMonth(month);
    };

    return (
        <div style={styles.columns}>
            {/* Column 1 — Years */}
            <div style={styles.column}>
                {years.map((year) => (
                    <div
                        key={year}
                        style={Object.assign(
                            {},
                            styles.row,
                            activeYear === year && styles.rowActive
                        )}
                        onClick={() => handleYearClick(year)}
                    >
                        <img
                            src={activeYear === year ? directoryOpen : directoryClosed}
                            style={styles.rowIcon}
                            alt=""
                        />
                        <span style={Object.assign(
                            {},
                            styles.rowLabel,
                            activeYear === year && styles.rowLabelActive
                        )}>
                            {year}
                        </span>
                        <span style={Object.assign(
                            {},
                            styles.disclosure,
                            activeYear === year && styles.disclosureActive
                        )}>
                            ›
                        </span>
                    </div>
                ))}
            </div>

            <div style={styles.divider} />

            {/* Column 2 — Months */}
            <div style={styles.column}>
                {months.map((month) => (
                    <div
                        key={month}
                        style={Object.assign(
                            {},
                            styles.row,
                            activeMonth === month && styles.rowActive
                        )}
                        onClick={() => handleMonthClick(month)}
                    >
                        <img
                            src={activeMonth === month ? directoryOpen : directoryClosed}
                            style={styles.rowIcon}
                            alt=""
                        />
                        <span style={Object.assign(
                            {},
                            styles.rowLabel,
                            activeMonth === month && styles.rowLabelActive
                        )}>
                            {MONTH_NAMES[month] ?? month}
                        </span>
                        <span style={Object.assign(
                            {},
                            styles.disclosure,
                            activeMonth === month && styles.disclosureActive
                        )}>
                            ›
                        </span>
                    </div>
                ))}
            </div>

            <div style={styles.divider} />

            {/* Column 3 — Posts */}
            <div style={styles.column}>
                {posts.map((post) => {
                    const isSelected =
                        selected?.slug === post.slug &&
                        selected?.year === post.year &&
                        selected?.month === post.month;
                    return (
                        <div
                            key={post.slug}
                            style={Object.assign(
                                {},
                                styles.row,
                                isSelected && styles.rowActive
                            )}
                            onClick={() => onSelect(post)}
                        >
                            <img src={fileIcon} style={styles.rowIcon} alt="" />
                            <span style={Object.assign(
                                {},
                                styles.rowLabel,
                                isSelected && styles.rowLabelActive
                            )}>
                                {post.title}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    columns: {
        flexDirection: 'row',
        width: 420,
        minWidth: 420,
        height: '100%',
        borderRight: '2px solid #808080',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        flexShrink: 0,
    },
    column: {
        flexDirection: 'column',
        flex: 1,
        height: '100%',
        overflowY: 'auto',
        alignItems: 'stretch',
    },
    divider: {
        width: 1,
        height: '100%',
        backgroundColor: '#c0c0c0',
        flexShrink: 0,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: '3px 6px',
        cursor: 'pointer',
        minHeight: 24,
        flexShrink: 0,
    },
    rowActive: {
        backgroundColor: '#0000aa',
    },
    rowIcon: {
        width: 16,
        height: 16,
        imageRendering: 'pixelated',
        marginRight: 5,
        flexShrink: 0,
    },
    rowLabel: {
        fontSize: 11,
        fontFamily: 'Arial, sans-serif',
        color: '#000000',
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    rowLabelActive: {
        color: '#ffffff',
    },
    disclosure: {
        fontSize: 14,
        color: '#555555',
        marginLeft: 4,
        flexShrink: 0,
        lineHeight: 1,
    },
    disclosureActive: {
        color: '#ffffff',
    },
};

export default BlogFileTree;
