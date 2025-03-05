import type React from "react"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[280px]">
                <div className="px-2 py-6">
                  <DashboardNav />
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold">BlogGen AI</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserNav user={session.user} />
          </div>
        </div>
      </header>
      <div className="container flex-1">
        <div className="grid md:grid-cols-[200px_1fr] gap-8">
          <aside className="hidden md:block py-8">
            <div className="sticky top-[80px]">
              <DashboardNav />
            </div>
          </aside>
          <main className="min-w-0 py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
