"use client";

/**
 * Virtualized Grid Component for Large Lists
 * Uses TanStack Virtual for efficient rendering
 */

import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '@/lib/utils';

interface VirtualGridProps<T> {
  items: T[];
  columns?: number;
  itemHeight?: number;
  overscan?: number;
  className?: string;
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyState?: React.ReactNode;
}

export function VirtualGrid<T>({
  items,
  columns = 3,
  itemHeight = 300,
  overscan = 5,
  className,
  renderItem,
  emptyState,
}: VirtualGridProps<T>) {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan,
    lanes: columns, // Multi-column support
  });

  const virtualItems = virtualizer.getVirtualItems();

  if (items.length === 0) {
    return emptyState || (
      <div className="flex items-center justify-center py-12">
        <p className="text-[color:var(--md-sys-color-on-surface-variant)]">
          No items to display
        </p>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className={cn('overflow-auto', className)}
      style={{
        height: '100%',
        minHeight: '400px',
        maxHeight: 'calc(100vh - 300px)',
      }}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: virtualItem.lane * (100 / columns) + '%',
              width: `${100 / columns}%`,
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Virtualized List Component for Large Lists
 * Simpler single-column version
 */

interface VirtualListProps<T> {
  items: T[];
  itemHeight?: number;
  overscan?: number;
  className?: string;
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyState?: React.ReactNode;
}

export function VirtualList<T>({
  items,
  itemHeight = 80,
  overscan = 5,
  className,
  renderItem,
  emptyState,
}: VirtualListProps<T>) {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan,
  });

  const virtualItems = virtualizer.getVirtualItems();

  if (items.length === 0) {
    return emptyState || (
      <div className="flex items-center justify-center py-12">
        <p className="text-[color:var(--md-sys-color-on-surface-variant)]">
          No items to display
        </p>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className={cn('overflow-auto', className)}
      style={{
        height: '100%',
        minHeight: '300px',
        maxHeight: 'calc(100vh - 300px)',
      }}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Loading skeleton for virtualized lists
 */
export function VirtualListSkeleton({
  count = 10,
  itemHeight = 80,
}: {
  count?: number;
  itemHeight?: number;
}) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl bg-[color:var(--md-sys-color-surface-container-highest)]"
          style={{ height: itemHeight }}
        />
      ))}
    </div>
  );
}

/**
 * Loading skeleton for virtualized grids
 */
export function VirtualGridSkeleton({
  count = 9,
  columns = 3,
  itemHeight = 300,
}: {
  count?: number;
  columns?: number;
  itemHeight?: number;
}) {
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl bg-[color:var(--md-sys-color-surface-container-highest)]"
          style={{ height: itemHeight }}
        />
      ))}
    </div>
  );
}
