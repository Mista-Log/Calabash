"use client";

import * as React from "react";

export interface DropdownMenuProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

const DropdownMenuContext = React.createContext<
  | {
      open: boolean;
      onOpenChange: (open: boolean) => void;
      triggerRef: React.RefObject<HTMLElement | null>;
      triggerId: string;
    }
  | undefined
>(undefined);

const useDropdownMenu = () => {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error(
      "DropdownMenu components must be used within a DropdownMenu",
    );
  }
  return context;
};

const assignRef = <T,>(ref: React.Ref<T> | undefined, value: T) => {
  if (!ref) return;
  if (typeof ref === "function") {
    ref(value);
    return;
  }
  (ref as React.MutableRefObject<T>).current = value;
};

const DropdownMenu = ({
  open: controlledOpen,
  onOpenChange,
  children,
}: DropdownMenuProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLElement>(null);
  const triggerId = React.useId();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  return (
    <DropdownMenuContext.Provider
      value={{ open, onOpenChange: handleOpenChange, triggerRef, triggerId }}
    >
      {children}
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode;
  }
>(({ children, onClick, ...props }, ref) => {
  const { onOpenChange, open, triggerRef, triggerId } = useDropdownMenu();

  return (
    <button
      id={triggerId}
      ref={(node) => {
        assignRef(ref, node);
        triggerRef.current = node;
      }}
      onClick={(e) => {
        onOpenChange(!open);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuGroup = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ children, ...props }, ref) => (
  <div ref={ref as React.Ref<HTMLDivElement>} {...props}>
    {children}
  </div>
));
DropdownMenuGroup.displayName = "DropdownMenuGroup";

const DropdownMenuPortal = ({ children }: { children?: React.ReactNode }) => {
  return <>{children}</>;
};

const DropdownMenuSub = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode;
  }
>(({ children, ...props }, ref) =>
  React.createElement(
    "md-sub-menu",
    {
      ...props,
      ref,
    },
    children,
  ),
);
DropdownMenuSub.displayName = "DropdownMenuSub";

const DropdownMenuSubTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & {
    inset?: boolean;
    children?: React.ReactNode;
  }
>(({ children, itemType: _itemType, ...props }, ref) => (
  <DropdownMenuItem ref={ref} slot="item" {...props}>
    {children}
  </DropdownMenuItem>
));
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

const DropdownMenuSubContent = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ children, ...props }, ref) =>
  React.createElement(
    "md-menu",
    {
      ...props,
      slot: "menu",
      ref,
    },
    children,
  ),
);
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

type MenuElement = HTMLElement & {
  open: boolean;
  show: () => void;
  close: () => void;
  anchor: string;
  anchorCorner: string;
  menuCorner: string;
  xOffset: number;
  yOffset: number;
};

const resolveMenuPosition = (
  side: "top" | "bottom" | "left" | "right",
  align: "start" | "end" | "center",
  sideOffset: number,
) => {
  let anchorBlock: "start" | "end" = "end";
  let anchorInline: "start" | "end" = "start";
  let menuBlock: "start" | "end" = "start";
  let menuInline: "start" | "end" = "start";
  let xOffset = 0;
  let yOffset = 0;

  if (side === "top") {
    anchorBlock = "start";
    menuBlock = "end";
    yOffset = -sideOffset;
  }
  if (side === "bottom") {
    anchorBlock = "end";
    menuBlock = "start";
    yOffset = sideOffset;
  }
  if (side === "left") {
    anchorInline = "start";
    menuInline = "end";
    xOffset = -sideOffset;
  }
  if (side === "right") {
    anchorInline = "end";
    menuInline = "start";
    xOffset = sideOffset;
  }

  if (side === "top" || side === "bottom") {
    if (align === "end") {
      anchorInline = "end";
      menuInline = "end";
    }
  }
  if (side === "left" || side === "right") {
    if (align === "end") {
      anchorBlock = "end";
      menuBlock = "end";
    }
  }

  return {
    anchorCorner: `${anchorBlock}-${anchorInline}`,
    menuCorner: `${menuBlock}-${menuInline}`,
    xOffset,
    yOffset,
  };
};

const DropdownMenuContent = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & {
    sideOffset?: number;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "end" | "center";
  }
>(
  (
    { sideOffset = 4, side = "bottom", align = "start", children, ...props },
    _ref,
  ) => {
    const { open, onOpenChange, triggerId } = useDropdownMenu();
    const menuId = `${triggerId}-menu`;
    const [mounted, setMounted] = React.useState(false);
    const wasOpenRef = React.useRef(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    React.useEffect(() => {
      if (!mounted) return;
      const menu = document.getElementById(menuId) as MenuElement | null;
      if (!menu) return;
      const handleClosed = () => onOpenChange(false);
      menu.addEventListener("closed", handleClosed);
      return () => {
        menu.removeEventListener("closed", handleClosed);
      };
    }, [menuId, mounted, onOpenChange]);

    React.useEffect(() => {
      if (!mounted) return;
      const menu = document.getElementById(menuId) as MenuElement | null;
      if (!menu) return;
      const { anchorCorner, menuCorner, xOffset, yOffset } = resolveMenuPosition(
        side,
        align,
        sideOffset,
      );
      menu.anchor = triggerId;
      menu.anchorCorner = anchorCorner;
      menu.menuCorner = menuCorner;
      menu.xOffset = xOffset;
      menu.yOffset = yOffset;
      if (open) {
        customElements.whenDefined("md-menu").then(() => {
          const currentMenu = document.getElementById(menuId) as MenuElement | null;
          if (!currentMenu) return;
          currentMenu.show?.();
        });
      } else if (wasOpenRef.current) {
        menu.close?.();
      } else {
        menu.open = false;
      }
      wasOpenRef.current = open;
    }, [align, menuId, mounted, open, side, sideOffset, triggerId]);

    if (!mounted) {
      return null;
    }

    return React.createElement(
      "md-menu",
      {
        ...props,
        id: menuId,
      },
      children,
    );
  },
);
DropdownMenuContent.displayName = "DropdownMenuContent";

const renderMenuItemChildren = (children: React.ReactNode) => {
  const items = React.Children.toArray(children);
  if (items.length >= 2 && React.isValidElement(items[0])) {
    const first = items[0] as React.ReactElement<{ slot?: string }>;
    const start =
      first.props.slot === undefined
        ? React.cloneElement(first, { key: "__start", slot: "start" })
        : first;
    return [
      start,
      React.createElement(
        "span",
        { key: "__headline", slot: "headline" },
        items.slice(1),
      ),
    ];
  }
  return React.createElement("span", { slot: "headline" }, children);
};

const DropdownMenuItem = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & {
    inset?: boolean;
    disabled?: boolean;
    keepOpen?: boolean;
    menuItemType?: "menuitem" | "menuitemcheckbox" | "menuitemradio" | "link";
  }
>(({ children, disabled, keepOpen, menuItemType = "menuitem", ...props }, ref) =>
  React.createElement(
    "md-menu-item",
    {
      ...props,
      type: menuItemType,
      disabled: disabled || undefined,
      "keep-open": keepOpen || undefined,
      ref,
    },
    renderMenuItemChildren(children),
  ),
);
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuCheckboxItem = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & {
    checked?: boolean;
    children?: React.ReactNode;
    disabled?: boolean;
  }
>(({ checked = false, ...props }, ref) => (
  <DropdownMenuItem
    ref={ref}
    menuItemType="menuitemcheckbox"
    aria-checked={checked}
    {...props}
  />
));
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

const DropdownMenuRadioItem = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode;
    disabled?: boolean;
  }
>(({ ...props }, ref) => (
  <DropdownMenuItem ref={ref} menuItemType="menuitemradio" {...props} />
));
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

const DropdownMenuRadioGroup = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ children, ...props }, ref) => (
  <div ref={ref as React.Ref<HTMLDivElement>} role="group" {...props}>
    {children}
  </div>
));
DropdownMenuRadioGroup.displayName = "DropdownMenuRadioGroup";

const DropdownMenuLabel = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & {
    inset?: boolean;
  }
>(({ ...props }, ref) => (
  <DropdownMenuItem ref={ref} disabled keepOpen {...props} />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ ...props }, ref) =>
  React.createElement("md-divider", {
    ...props,
    ref,
  }),
);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuShortcut = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span {...props}>{children}</span>;
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
