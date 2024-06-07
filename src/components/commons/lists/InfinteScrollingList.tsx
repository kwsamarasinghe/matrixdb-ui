// InfiniteScroll.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

interface InfiniteScrollProps {
    listItems: any[],
    children: React.ReactNode;
}

const InfiniteScrollingList: React.FC<InfiniteScrollProps> = ({ listItems, children }) => {
    const [items, setItems] = useState<any[]>(listItems);
    const observer = useRef<IntersectionObserver | null>(null);
    const [loading, setLoading] = useState(false);
    const lastElementRef = useRef<HTMLDivElement>(null);

    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        if (loading) return;
        if (!hasMore) return;
        if (!lastElementRef.current) return;

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setLoading(true);
                loadMoreItems().finally(() => setLoading(false));
            }
        });

        observer.current.observe(lastElementRef.current);

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [loading]);


    interface Item {
        id: number;
        text: string;
    }

    const ITEMS_PER_PAGE = 10;

    const fetchItems = async (page: number): Promise<Item[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const start = page * ITEMS_PER_PAGE;
                const end = start + ITEMS_PER_PAGE;
                resolve(items.slice(start, end));
            }, 1000); // Simulate network delay
        });
    };
    const loadMoreItems = async () => {
        const newItems = await fetchItems(page);
        setItems((prev) => [...prev, ...newItems]);
        setPage((prev) => prev + 1);
        if (newItems.length < ITEMS_PER_PAGE) {
            setHasMore(false);
        }
    };

    useEffect(() => {
        loadMoreItems();
    }, []);

    return (
        <Box>
            {children}
            <div ref={lastElementRef} style={{ height: '1px' }} />
        </Box>
    );
};

export default InfiniteScrollingList;
