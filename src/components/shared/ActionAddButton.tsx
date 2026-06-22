"use client";

import Link from "next/link";
import { Button, type ButtonProps } from "@/components/ui/button";

export type ActionAddButtonMode = "modal" | "drawer" | "page";

export interface ActionAddButtonProps extends ButtonProps {
  label: string;
  mode: ActionAddButtonMode;
  href?: string;
  onClick?: () => void;
}

export function ActionAddButton({
  label,
  mode,
  href,
  onClick,
  ...props
}: ActionAddButtonProps) {
  if (mode === "page") {
    if (!href) {
      return (
        <Button type="button" disabled {...props}>
          {label}
        </Button>
      );
    }

    return (
      <Link href={href} className="inline-flex">
        <Button type="button" {...props}>
          {label}
        </Button>
      </Link>
    );
  }

  return (
    <Button type="button" onClick={onClick} {...props}>
      {label}
    </Button>
  );
}
