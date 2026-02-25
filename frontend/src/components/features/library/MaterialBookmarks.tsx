"use client";

import * as React from "react";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { M3Button, Card, CardContent, Input } from "@/components/core";

export interface Bookmark {
  id: string;
  pageNumber: number;
  note: string;
  createdAt: string;
}

interface MaterialBookmarksProps {
  materialId: string;
  currentPage?: number;
  onNavigateToPage?: (page: number) => void;
}

export function MaterialBookmarks({ 
  materialId, 
  currentPage,
  onNavigateToPage 
}: MaterialBookmarksProps) {
  const [bookmarks, setBookmarks] = React.useState<Bookmark[]>([]);
  const [isAddingBookmark, setIsAddingBookmark] = React.useState(false);
  const [noteText, setNoteText] = React.useState('');

  const storageKey = `calabash-bookmarks-${materialId}`;

  // Load bookmarks from localStorage
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setBookmarks(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load bookmarks:', e);
      }
    }
  }, [storageKey]);

  // Save bookmarks to localStorage
  const saveBookmarks = React.useCallback((newBookmarks: Bookmark[]) => {
    setBookmarks(newBookmarks);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(newBookmarks));
    }
  }, [storageKey]);

  const addBookmark = () => {
    if (!currentPage) return;
    
    const newBookmark: Bookmark = {
      id: `bookmark-${Date.now()}`,
      pageNumber: currentPage,
      note: noteText || `Page ${currentPage}`,
      createdAt: new Date().toISOString(),
    };
    
    const newBookmarks = [...bookmarks, newBookmark];
    saveBookmarks(newBookmarks);
    setIsAddingBookmark(false);
    setNoteText('');
  };

  const removeBookmark = (id: string) => {
    const newBookmarks = bookmarks.filter(b => b.id !== id);
    saveBookmarks(newBookmarks);
  };

  const isCurrentPageBookmarked = bookmarks.some(b => b.pageNumber === currentPage);

  return (
    <div className="space-y-4">
      {/* Add Bookmark Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
          Bookmarks ({bookmarks.length})
        </h3>
        <M3Button
          size="sm"
          variant={isAddingBookmark ? "filled" : "outlined"}
          onClick={() => setIsAddingBookmark(!isAddingBookmark)}
          disabled={!currentPage}
        >
          <MaterialSymbol icon={isAddingBookmark ? "close" : "bookmark_add"} size={18} />
          {isAddingBookmark ? 'Cancel' : 'Add'}
        </M3Button>
      </div>

      {/* Add Bookmark Form */}
      {isAddingBookmark && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div>
              <label className="text-[13px] font-medium text-[color:var(--md-sys-color-on-surface-variant)]">
                Page {currentPage}
              </label>
            </div>
            <Input
              placeholder="Add a note (optional)..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full"
            />
            <div className="flex justify-end">
              <M3Button size="sm" onClick={addBookmark}>
                <MaterialSymbol icon="bookmark" size={18} />
                Save Bookmark
              </M3Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bookmarks List */}
      {bookmarks.length > 0 ? (
        <div className="space-y-2">
          {bookmarks.map((bookmark) => (
            <Card key={bookmark.id}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-3">
                  <button
                    onClick={() => onNavigateToPage?.(bookmark.pageNumber)}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <MaterialSymbol icon="bookmark" size={16} className="text-[color:var(--md-sys-color-primary)]" />
                      <span className="text-[14px] font-medium text-[color:var(--md-sys-color-on-surface)]">
                        {bookmark.note}
                      </span>
                    </div>
                    <p className="mt-1 text-[12px] text-[color:var(--md-sys-color-on-surface-variant)]">
                      Page {bookmark.pageNumber} • {new Date(bookmark.createdAt).toLocaleDateString()}
                    </p>
                  </button>
                  <M3Button
                    size="sm"
                    variant="text"
                    onClick={() => removeBookmark(bookmark.id)}
                    className="text-[color:var(--md-sys-color-error)]"
                  >
                    <MaterialSymbol icon="delete" size={18} />
                  </M3Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-[color:var(--md-sys-color-on-surface-variant)]">
          <MaterialSymbol icon="bookmark_border" size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-[14px]">No bookmarks yet</p>
          <p className="text-[12px]">Add bookmarks to quickly navigate to important pages</p>
        </div>
      )}
    </div>
  );
}
