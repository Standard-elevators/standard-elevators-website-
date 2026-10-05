"use client";

import React from "react";
import Link, { LinkProps } from "next/link";

interface TransitionLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>,
    LinkProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Standard Next.js client-side navigation link.
 * Preserves normal SPA routing without triggering unnecessary full-page animation reloads.
 */
export default function TransitionLink({
  href,
  children,
  className,
  onClick,
  prefetch = true,
  ...props
}: TransitionLinkProps) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </Link>
  );
}

