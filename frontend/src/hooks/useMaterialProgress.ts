"use client";

import * as React from "react";

interface MaterialProgress {
  materialId: string;
  completed: boolean;
  completedAt?: string;
  lastViewedAt: string;
  viewCount: number;
}

interface UseMaterialProgressResult {
  isCompleted: boolean;
  viewCount: number;
  markComplete: () => void;
  markIncomplete: () => void;
  trackView: () => void;
  progress: MaterialProgress | null;
}

export function useMaterialProgress(
  materialId: string,
  userId?: string
): UseMaterialProgressResult {
  const storageKey = userId 
    ? `calabash-progress-${userId}-${materialId}`
    : `calabash-progress-${materialId}`;

  const [progress, setProgress] = React.useState<MaterialProgress | null>(null);

  // Load progress from localStorage
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setProgress(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load progress:', e);
      }
    } else {
      // Initialize new progress
      const initial: MaterialProgress = {
        materialId,
        completed: false,
        lastViewedAt: new Date().toISOString(),
        viewCount: 0,
      };
      setProgress(initial);
    }
  }, [storageKey, materialId]);

  // Save progress to localStorage
  const saveProgress = React.useCallback((newProgress: MaterialProgress) => {
    setProgress(newProgress);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(newProgress));
    }
  }, [storageKey]);

  const markComplete = () => {
    if (!progress) return;
    
    const updated: MaterialProgress = {
      ...progress,
      completed: true,
      completedAt: new Date().toISOString(),
    };
    saveProgress(updated);

    // Dispatch event for parent components to listen
    window.dispatchEvent(new CustomEvent('material-progress', { 
      detail: { materialId, completed: true } 
    }));
  };

  const markIncomplete = () => {
    if (!progress) return;
    
    const updated: MaterialProgress = {
      ...progress,
      completed: false,
      completedAt: undefined,
    };
    saveProgress(updated);

    window.dispatchEvent(new CustomEvent('material-progress', { 
      detail: { materialId, completed: false } 
    }));
  };

  const trackView = () => {
    if (!progress) return;
    
    const updated: MaterialProgress = {
      ...progress,
      lastViewedAt: new Date().toISOString(),
      viewCount: progress.viewCount + 1,
    };
    saveProgress(updated);
  };

  return {
    isCompleted: progress?.completed ?? false,
    viewCount: progress?.viewCount ?? 0,
    markComplete,
    markIncomplete,
    trackView,
    progress,
  };
}

/**
 * Get course progress percentage based on completed materials
 */
export function useCourseProgress(
  materialIds: string[],
  userId?: string
): { percentage: number; completed: number; total: number } {
  const [completedCount, setCompletedCount] = React.useState(0);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    let count = 0;
    materialIds.forEach(id => {
      const storageKey = userId 
        ? `calabash-progress-${userId}-${id}`
        : `calabash-progress-${id}`;
      
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const progress = JSON.parse(stored);
          if (progress.completed) {
            count++;
          }
        } catch (e) {
          // Ignore
        }
      }
    });

    setCompletedCount(count);
  }, [materialIds, userId]);

  const total = materialIds.length;
  const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return {
    percentage,
    completed: completedCount,
    total,
  };
}
