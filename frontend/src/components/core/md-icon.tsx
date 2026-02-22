"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Icon name mapping from legacy icon names to Material Icons
 */
export const iconMap: Record<string, string> = {
  // Legacy icon names -> Material Icon names
  Search01: "search",
  Menu01: "menu",
  Menu02: "menu",
  Home01: "home",
  Dashboard: "dashboard",
  Library: "library_books",
  Book: "book",
  Note: "note",
  Calendar: "calendar_month",
  Settings: "settings",
  Analytics: "analytics",
  Support: "support_agent",
  Logout: "logout",
  Close: "close",
  Add: "add",
  Check: "check",
  Error: "error",
  Info: "info",
  Warning: "warning",
  Success: "check_circle",
  ArrowLeft: "arrow_back",
  ArrowRight: "arrow_forward",
  ArrowUp: "arrow_upward",
  ArrowDown: "arrow_downward",
  MoreVert: "more_vert",
  MoreHoriz: "more_horiz",
  Edit: "edit",
  Delete: "delete",
  Save: "save",
  Cancel: "cancel",
  Confirm: "check_circle",
  Upload: "upload",
  Download: "download",
  Share: "share",
  Copy: "content_copy",
  Link: "link",
  Unlink: "link_off",
  Image: "image",
  Video: "videocam",
  Audio: "audio_file",
  File: "description",
  File01: "description",
  File02: "description",
  Folder: "folder",
  Folder01: "folder",
  Pdf: "picture_as_pdf",
  Doc: "description",
  Excel: "table_chart",
  Ppt: "presentation",
  Zip: "folder_zip",
  User: "person",
  Users: "groups",
  Profile: "account_circle",
  Avatar: "account_circle",
  Notification: "notifications",
  Bell: "notifications",
  Message: "chat",
  Email: "mail",
  Phone: "phone",
  Location: "location_on",
  Time: "schedule",
  Date: "calendar_today",
  Clock: "schedule",
  Timer: "timer",
  Star: "star",
  StarOutline: "star_outline",
  Favorite: "favorite",
  FavoriteOutline: "favorite_border",
  Bookmark: "bookmark",
  BookmarkOutline: "bookmark_border",
  Eye: "visibility",
  EyeOff: "visibility_off",
  Lock: "lock",
  Unlock: "lock_open",
  Security: "security",
  Shield: "shield",
  Verified: "verified",
  School: "school",
  GraduationCap: "school",
  Course: "book",
  Lesson: "menu_book",
  Assignment: "assignment",
  Task: "task",
  Checklist: "checklist",
  Done: "done",
  Pending: "pending",
  InProgress: "schedule",
  Complete: "check_circle",
  Incomplete: "radio_button_unchecked",
  Play: "play_arrow",
  Pause: "pause",
  Stop: "stop",
  Replay: "replay",
  Forward: "forward",
  Rewind: "rewind",
  VolumeUp: "volume_up",
  VolumeDown: "volume_down",
  VolumeOff: "volume_off",
  Mic: "mic",
  MicOff: "mic_off",
  Camera: "photo_camera",
  CameraOff: "no_photography",
  Screenshot: "screenshot",
  Fullscreen: "fullscreen",
  FullscreenExit: "fullscreen_exit",
  ZoomIn: "zoom_in",
  ZoomOut: "zoom_out",
  Filter: "filter_list",
  Sort: "sort",
  Search: "search",
  Refresh: "refresh",
  Sync: "sync",
  History: "history",
  Recent: "history",
  TrendingUp: "trending_up",
  TrendingDown: "trending_down",
  Chart: "bar_chart",
  Graph: "insert_chart",
  Table: "table_chart",
  List: "list",
  GridView: "grid_view",
  ViewList: "view_list",
  ViewModule: "view_module",
  ViewComfy: "view_comfy",
  ViewCompact: "view_compact",
  ViewDay: "view_day",
  ViewAgenda: "view_agenda",
  ViewCarousel: "view_carousel",
  ViewColumn: "view_column",
  ViewStream: "view_stream",
  ViewWeek: "view_week",
  ViewHeadline: "view_headline",
  ViewQuilt: "view_quilt",
  ViewSidebar: "view_sidebar",
  ViewInAr: "view_in_ar",
  DragIndicator: "drag_indicator",
  Reorder: "reorder",
  Move: "drag_indicator",
  Expand: "expand_more",
  Collapse: "expand_less",
  ExpandAll: "unfold_more",
  CollapseAll: "unfold_less",
  ChevronLeft: "chevron_left",
  ChevronRight: "chevron_right",
  ChevronUp: "chevron_up",
  ChevronDown: "chevron_down",
};

export interface MdIconProps
  extends React.HTMLAttributes<HTMLElement> {
  name?: string;
  filled?: boolean;
  outlined?: boolean;
  sharp?: boolean;
  size?: number | string;
}

/**
 * Material 3 Icon Component
 *
 * Uses Material Symbols Rounded font by default
 * Supports filled, outlined, and sharp variants
 */
export const MdIcon = React.forwardRef<HTMLElement, MdIconProps>(
  ({ name, filled, outlined, sharp, size, className, children, ...props }, ref) => {
    // Get icon name from children or name prop
    const iconName = children?.toString() || name || "";

    // Map legacy icon names to Material Icons
    const mappedIcon = iconMap[iconName] || iconName;

    // Determine local Material Symbols family/variation settings.
    const fillValue = filled ? 1 : 0;
    const weightValue = outlined ? 300 : 400;
    const fontFamily = sharp
      ? "Material Symbols Sharp"
      : outlined
      ? "Material Symbols Outlined"
      : "Material Symbols Rounded";

    return (
      <md-icon
        ref={ref}
        className={cn("material-symbols-rounded", className)}
        style={{
          fontFamily,
          fontVariationSettings: `'FILL' ${fillValue}, 'wght' ${weightValue}, 'GRAD' 0, 'opsz' 24`,
          fontSize: size ? (typeof size === "number" ? `${size}px` : size) : undefined,
          ...props.style,
        }}
        {...props}
      >
        {mappedIcon}
      </md-icon>
    );
  },
);
MdIcon.displayName = "MdIcon";

/**
 * Helper function to get mapped icon name
 */
export function getIconName(name: string): string {
  return iconMap[name] || name;
}
