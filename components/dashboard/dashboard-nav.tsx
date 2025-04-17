"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const links = [
  {
    href: "/dashboard",
    label: "Overview",
    prefetch: true
  },
  {
    href: "/dashboard/blogs",
    label: "My Blogs",
    prefetch: true
  },
  {
    href: "/dashboard/create",
    label: "Create Blog",
    prefetch: true
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    prefetch: true
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          prefetch={link.prefetch}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === link.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
