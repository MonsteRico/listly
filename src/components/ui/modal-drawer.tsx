import * as React from "react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import type { DialogTriggerProps } from "@radix-ui/react-dialog";
import { useMediaQuery } from "@/lib/useMediaQuery";

export function DrawerDialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
  onOpenChange: (open: boolean) => void;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {children}
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {children}
    </Drawer>
  );
}

export const DrawerDialogTrigger = React.forwardRef(
  function DrawerDialogTrigger(
    { children, ...props }: { children: React.ReactNode } & DialogTriggerProps,
    ref: React.ForwardedRef<HTMLButtonElement>,
  ) {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isDesktop) {
      return (
        <DialogTrigger ref={ref} {...props}>
          {children}
        </DialogTrigger>
      );
    }

    return (
      <DrawerTrigger ref={ref} {...props}>
        {children}
      </DrawerTrigger>
    );
  },
);

export function DrawerDialogHeader({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <DialogHeader {...props} className={className}>
        {children}
      </DialogHeader>
    );
  }

  return (
    <DrawerHeader {...props} className={className}>
      {children}
    </DrawerHeader>
  );
}

export function DrawerDialogFooter({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return <DialogHeader {...props} className={className}>{children}</DialogHeader>;
  }

  return <DrawerHeader {...props} className={className}>{children}</DrawerHeader>;
}

export function DrawerDialogTitle({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <DialogTitle {...props} className={className}>
        {children}
      </DialogTitle>
    );
  }

  return (
    <DrawerTitle {...props} className={className}>
      {children}
    </DrawerTitle>
  );
}

export function DrawerDialogDescription({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <DialogDescription {...props} className={className}>
        {children}
      </DialogDescription>
    );
  }

  return (
    <DrawerDescription {...props} className={className}>
      {children}
    </DrawerDescription>
  );
}

export function DrawerDialogContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return <DialogContent>{children}</DialogContent>;
  }

  return <DrawerContent className="p-5">{children}</DrawerContent>;
}
