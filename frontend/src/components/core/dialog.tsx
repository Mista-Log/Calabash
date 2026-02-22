"use client";

import * as React from "react";

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

type DialogContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialogId: string;
};

const DialogContext = React.createContext<DialogContextValue | undefined>(
  undefined,
);

const useDialog = () => {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within a Dialog");
  }
  return context;
};

let dialogIdCounter = 0;
const nextDialogId = () => {
  dialogIdCounter += 1;
  return `dialog-${dialogIdCounter}`;
};

const Dialog = ({ open: controlledOpen, onOpenChange, children }: DialogProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const dialogId = React.useMemo(() => nextDialogId(), []);

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
    <DialogContext.Provider
      value={{ open, onOpenChange: handleOpenChange, dialogId }}
    >
      {children}
    </DialogContext.Provider>
  );
};

const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { onOpenChange } = useDialog();

  return (
    <button
      ref={ref}
      onClick={(event) => {
        onOpenChange(true);
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </button>
  );
});
DialogTrigger.displayName = "DialogTrigger";

const DialogPortal = ({ children }: { children?: React.ReactNode }) => {
  return <>{children}</>;
};

const DialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { onOpenChange } = useDialog();

  return (
    <button
      ref={ref}
      onClick={(event) => {
        onOpenChange(false);
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </button>
  );
});
DialogClose.displayName = "DialogClose";

const DialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((_props, _ref) => null);
DialogOverlay.displayName = "DialogOverlay";

type DialogElement = HTMLElement & {
  open: boolean;
  show: () => Promise<void> | void;
  close: (returnValue?: string) => Promise<void> | void;
};

const isCallable = (value: unknown): value is (...args: unknown[]) => unknown =>
  typeof value === "function";

const flattenChildren = (children: React.ReactNode): React.ReactNode[] => {
  const result: React.ReactNode[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === React.Fragment) {
      const fragment = child as React.ReactElement<{ children?: React.ReactNode }>;
      result.push(...flattenChildren(fragment.props.children));
      return;
    }
    result.push(child);
  });
  return result;
};

const DialogContent = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ children, className, ...props }, _ref) => {
  const { open, onOpenChange, dialogId } = useDialog();

  React.useEffect(() => {
    const dialog = document.getElementById(dialogId) as DialogElement | null;
    if (!dialog) return;

    const handleClosed = () => onOpenChange(false);
    const handleCancel = () => onOpenChange(false);

    dialog.addEventListener("closed", handleClosed);
    dialog.addEventListener("cancel", handleCancel);
    return () => {
      dialog.removeEventListener("closed", handleClosed);
      dialog.removeEventListener("cancel", handleCancel);
    };
  }, [dialogId, onOpenChange]);

  React.useEffect(() => {
    const dialog = document.getElementById(dialogId) as DialogElement | null;
    if (!dialog) return;
    if (open) {
      if (isCallable(dialog.show)) {
        void dialog.show();
      } else {
        dialog.open = true;
      }
      return;
    }
    if (isCallable(dialog.close)) {
      void dialog.close();
      return;
    }
    dialog.open = false;
  }, [dialogId, open]);

  const flatChildren = flattenChildren(children);
  const slotted: React.ReactNode[] = [];
  const content: React.ReactNode[] = [];

  flatChildren.forEach((child) => {
    if (!React.isValidElement(child)) {
      content.push(child);
      return;
    }
    const element = child as React.ReactElement<{ slot?: string }>;
    const slot = element.props.slot;
    if (slot) {
      slotted.push(element);
      return;
    }
    content.push(element);
  });

  return React.createElement(
    "md-dialog",
    {
      ...props,
      id: dialogId,
      open: open || undefined,
      className: ["app-dialog", className].filter(Boolean).join(" "),
    },
    ...slotted,
    content.length > 0
      ? React.createElement("div", { slot: "content", className: "app-dialog__content" }, content)
      : null,
  );
});
DialogContent.displayName = "DialogContent";

const DialogHeader = ({
  children,
}: React.HTMLAttributes<HTMLDivElement>) => <>{children}</>;
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div slot="actions" {...props}>
    {children}
  </div>
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ children, ...props }, ref) => (
  <h2 ref={ref} slot="headline" {...props}>
    {children}
  </h2>
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ children, ...props }, ref) => (
  <p ref={ref} slot="content" {...props}>
    {children}
  </p>
));
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
