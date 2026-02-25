"use client";

import * as React from "react";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { M3Button, Card, CardContent, Chip, Badge } from "@/components/core";
import type { Material } from "@/services/api";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useToast } from "@/components/core/toast";

interface MaterialManagementProps {
  materials: Material[];
  courseId?: string;
  onEdit?: (material: Material) => void;
}

export function MaterialManagement({ 
  materials, 
  courseId,
  onEdit 
}: MaterialManagementProps) {
  const { updateMaterial, setVisibility, batchSetVisibility } = useLibraryStore();
  const { addToast } = useToast();
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [bulkAction, setBulkAction] = React.useState<'visibility' | 'delete' | null>(null);

  const handleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === materials.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(materials.map(m => m.id));
    }
  };

  const handleBulkVisibility = async (visibility: 'public' | 'private') => {
    if (selectedIds.length === 0) return;
    
    try {
      await batchSetVisibility(selectedIds, visibility);
      addToast(
        `Set ${selectedIds.length} materials to ${visibility}`,
        'success'
      );
      setSelectedIds([]);
      setBulkAction(null);
    } catch {
      addToast('Failed to update visibility', 'error');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This action cannot be undone.`)) return;
    
    try {
      await updateMaterial(id, { visibility: 'private' as const });
      addToast('Material deleted', 'success');
    } catch {
      addToast('Failed to delete material', 'error');
    }
  };

  const getTypeIcon = (type: Material['type']) => {
    const icons: Record<Material['type'], string> = {
      'pdf': 'description',
      'video': 'video_file',
      'past-question': 'quiz',
      'zip': 'folder_zip',
      'image': 'image',
    };
    return icons[type] || 'description';
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions Toolbar */}
      {selectedIds.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">
                  {selectedIds.length} selected
                </Badge>
                <div className="flex gap-2">
                  <M3Button
                    size="sm"
                    variant="outlined"
                    onClick={() => handleBulkVisibility('public')}
                  >
                    Make Public
                  </M3Button>
                  <M3Button
                    size="sm"
                    variant="outlined"
                    onClick={() => handleBulkVisibility('private')}
                  >
                    Make Private
                  </M3Button>
                  <M3Button
                    size="sm"
                    variant="text"
                    onClick={() => {
                      setSelectedIds([]);
                      setBulkAction(null);
                    }}
                  >
                    Cancel
                  </M3Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Materials List */}
      <div className="space-y-2">
        {materials.map((material) => (
          <MaterialRow
            key={material.id}
            material={material}
            isSelected={selectedIds.includes(material.id)}
            onSelect={() => handleSelect(material.id)}
            onEdit={() => onEdit?.(material)}
            onDelete={() => handleDelete(material.id, material.title)}
            getTypeIcon={getTypeIcon}
          />
        ))}
      </div>

      {materials.length === 0 && (
        <div className="text-center py-12 text-[color:var(--md-sys-color-on-surface-variant)]">
          <MaterialSymbol icon="folder_open" size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-[16px] font-medium">No materials yet</p>
          <p className="mt-1 text-[14px]">Upload your first course material to get started</p>
        </div>
      )}
    </div>
  );
}

// Material Row Component
function MaterialRow({
  material,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  getTypeIcon,
}: {
  material: Material;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  getTypeIcon: (type: Material['type']) => string;
}) {
  const [showActions, setShowActions] = React.useState(false);

  return (
    <Card 
      className="transition-colors hover:bg-[color:var(--md-sys-color-surface-container)]"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Checkbox */}
          <button
            onClick={onSelect}
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded border-2 transition-colors",
              isSelected
                ? "bg-[color:var(--md-sys-color-primary)] border-[color:var(--md-sys-color-primary)]"
                : "border-[color:var(--md-sys-color-outline)]"
            )}
          >
            {isSelected && (
              <MaterialSymbol icon="check" size={18} className="text-white" />
            )}
          </button>

          {/* Icon */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]">
            <MaterialSymbol icon={getTypeIcon(material.type)} size={24} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-semibold text-[color:var(--md-sys-color-on-surface)] truncate">
                {material.title}
              </h3>
              {material.visibility === 'private' && (
                <Badge variant="outline" className="text-[11px]">
                  <MaterialSymbol icon="lock" size={12} />
                  Private
                </Badge>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
              <span>{material.courseCode}</span>
              <span>•</span>
              <span>{material.uploader}</span>
              <span>•</span>
              <span>{new Date(material.uploadDate).toLocaleDateString()}</span>
              {material.size && (
                <>
                  <span>•</span>
                  <span>{material.size}</span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className={cn(
            "flex items-center gap-2 transition-opacity",
            showActions ? "opacity-100" : "opacity-0"
          )}>
            <M3Button
              variant="text"
              size="sm"
              onClick={onEdit}
              title="Edit details"
            >
              <MaterialSymbol icon="edit" size={18} />
            </M3Button>
            <M3Button
              variant="text"
              size="sm"
              onClick={onDelete}
              className="text-[color:var(--md-sys-color-error)]"
              title="Delete"
            >
              <MaterialSymbol icon="delete" size={18} />
            </M3Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper for classnames
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
