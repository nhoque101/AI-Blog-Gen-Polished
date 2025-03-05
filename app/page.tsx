import Link from "next/link"
import { createServerClient } from "@/lib/supabase-server"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/dashboard/user-nav"
import { ArrowRight, BookOpen, Lightbulb, Sparkles } from "lucide-react"

export default async function HomePage() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold">
              BlogGen AI
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {session ? (
              <>
                <Button asChild variant="default">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
                <UserNav user={session.user} />
              </>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {session ? (
          <div className="container py-16">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-8 text-4xl font-bold">Welcome back to BlogGen AI!</h1>
              <div className="space-y-8">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                    <h3 className="mb-2 text-lg font-semibold">Continue Writing</h3>
                    <p className="mb-4 text-muted-foreground">Pick up where you left off with your blog posts.</p>
                    <Button asChild className="w-full">
                      <Link href="/dashboard/blogs">View My Blogs</Link>
                    </Button>
                  </div>
                  <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                    <h3 className="mb-2 text-lg font-semibold">Start New Blog</h3>
                    <p className="mb-4 text-muted-foreground">Create a new AI-generated blog post in minutes.</p>
                    <Button asChild className="w-full">
                      <Link href="/dashboard/create">Create New Blog</Link>
                    </Button>
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold">Quick Tips</h3>
                  <div className="flex justify-center">
                    <ul className="list-disc space-y-3 text-muted-foreground max-w-lg">
                      <li>Choose specific topics for better AI-generated content</li>
                      <li>Review and select from multiple generated titles</li>
                      <li>Edit and customize the generated content to match your style</li>
                      <li>Save drafts to work on them later</li>
                      <li>Add relevant images to make your blog posts more engaging</li>
                      <li>Structure your content with clear headings and sections</li>
                      <li>Review your content before publishing for best results</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <div className="container py-16 md:py-24">
                <div className="max-w-3xl mx-auto text-center">
                  <h1 className="text-4xl md:text-6xl font-bold mb-6">Create Amazing Blog Content with AI</h1>
                  <p className="text-xl md:text-2xl mb-8">
                    Generate engaging blog titles and content in seconds with our AI-powered platform. Save time and boost
                    your content strategy.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                      <Link href="/signup">Get Started Free</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="bg-white/10 text-white hover:bg-white/20">
                      <Link href="#features">Learn More</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 md:py-24 bg-background border-t">
              <div className="container">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Powerful Features</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="rounded-lg border bg-card p-8">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                      <Lightbulb className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">AI-Generated Titles</h3>
                    <p className="text-muted-foreground">
                      Get 10 creative blog title suggestions based on your topic. Choose the ones that resonate with your
                      audience.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-card p-8">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                      <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Full Blog Generation</h3>
                    <p className="text-muted-foreground">
                      Transform your selected titles into complete blog posts with well-structured content that engages
                      readers.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-card p-8">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                      <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Easy Management</h3>
                    <p className="text-muted-foreground">
                      Save, edit, and organize your blog posts in one place. Track your usage and manage your content
                      effortlessly.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 md:py-24 border-t">
              <div className="container">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
                <div className="max-w-3xl mx-auto space-y-12">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Enter Your Topic</h3>
                      <p className="text-muted-foreground">
                        Start by entering a topic you want to write about or choose from our suggested topics to get
                        inspiration.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Choose Your Titles</h3>
                      <p className="text-muted-foreground">
                        Our AI will generate 10 engaging title options. Select one or more titles that you'd like to develop
                        into full blog posts.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Generate Content</h3>
                      <p className="text-muted-foreground">
                        With a click of a button, transform your selected titles into complete blog posts. Edit the content
                        if needed to add your personal touch.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <div className="container text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Create Amazing Blog Content?</h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto">
                  Join thousands of content creators who are saving time and producing high-quality blog posts with our
                  AI-powered platform.
                </p>
                <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  <Link href="/signup">
                    Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="border-t py-6">
        <div className="container flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BlogGen AI. All rights reserved.
          </p>
          <nav className="flex gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

