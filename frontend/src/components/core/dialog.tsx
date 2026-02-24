<<<<<<< HEAD
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

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
      className: cn("app-dialog app-modal", className),
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
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("app-modal-header", className)} {...props}>
    {children}
  </div>
=======
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-200 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-200 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 sm:rounded-2xl",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className,
    )}
    {...props}
  />
>>>>>>> origin/main
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
<<<<<<< HEAD
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div slot="actions" className={cn("app-modal-footer", className)} {...props}>
    {children}
  </div>
=======
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
>>>>>>> origin/main
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
<<<<<<< HEAD
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
=======
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
>>>>>>> origin/main

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
