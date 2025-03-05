import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Blogs - BlogGen AI",
  description: "View and manage your AI-generated blog posts",
}

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 