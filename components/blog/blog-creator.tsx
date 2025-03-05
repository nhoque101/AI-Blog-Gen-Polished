"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react"
import { MarkdownRenderer } from "@/components/blog/markdown-renderer"
import { GeneratedBlogsDialog } from "@/components/blog/generated-blogs-dialog"
import { cn } from "@/lib/utils"

const suggestedTopics: string[] = [
  "Digital Marketing Strategies",
  "Artificial Intelligence in Business",
  "Remote Work Best Practices",
  "Personal Finance Tips",
  "Health and Wellness",
  "Sustainable Living",
]

const topicFormSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters" }),
})

type BlogTitle = {
  id: string
  title_text: string
  selected: boolean
}

export function BlogCreator({ userId }: { userId: string }) {
  const router = useRouter()
  const { toast } = useToast()

  // State for multi-step form
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [topic, setTopic] = useState("")
  const [titles, setTitles] = useState<BlogTitle[]>([])
  const [selectedTitleIds, setSelectedTitleIds] = useState<string[]>([])
  const [blogContent, setBlogContent] = useState("")
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")
  const [currentPostId, setCurrentPostId] = useState<string | null>(null)
  const [generatedPosts, setGeneratedPosts] = useState<Array<{ id: string; title: string }>>([])
  const [showGeneratedDialog, setShowGeneratedDialog] = useState(false)

  const steps = [
    { number: 1, title: "Choose Topic", description: "Enter your blog topic" },
    { number: 2, title: "Select Titles", description: "Choose from generated titles" },
    { number: 3, title: "Generate Content", description: "Create and edit your blog" },
  ]

  // Form for topic input
  const topicForm = useForm<z.infer<typeof topicFormSchema>>({
    resolver: zodResolver(topicFormSchema),
    defaultValues: {
      topic: "",
    },
  })

  // Handle topic submission
  async function onTopicSubmit(values: z.infer<typeof topicFormSchema>) {
    setIsLoading(true)
    setTopic(values.topic)

    try {
      const response = await fetch("/api/generate-titles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: values.topic }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to generate titles")
      }

      const data = await response.json()

      setTitles(
        data.titles.map((title: any) => ({
          ...title,
          selected: false,
        })),
      )

      setStep(2)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate titles",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle title selection
  function handleTitleSelect(titleId: string) {
    setSelectedTitleIds(prev => {
      const isSelected = prev.includes(titleId)
      if (isSelected) {
        return prev.filter(id => id !== titleId)
      } else {
        return [...prev, titleId]
      }
    })
    setTitles(
      titles.map((title) => ({
        ...title,
        selected: title.id === titleId ? !title.selected : title.selected,
      })),
    )
  }

  // Handle blog generation
  async function generateBlog() {
    if (selectedTitleIds.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one title",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Generate first post and show its content
      const firstResponse = await fetch("/api/generate-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ titleId: selectedTitleIds[0] }),
      })

      if (!firstResponse.ok) {
        const error = await firstResponse.json()
        throw new Error(error.error || "Failed to generate blog content")
      }

      const firstData = await firstResponse.json()
      setBlogContent(firstData.post.content)
      setCurrentPostId(firstData.post.id)
      setGeneratedPosts([{ id: firstData.post.id, title: titles.find(t => t.id === selectedTitleIds[0])?.title_text || '' }])
      setStep(3)

      // Generate remaining posts in background
      if (selectedTitleIds.length > 1) {
        toast({
          title: "Generating Additional Posts",
          description: `Creating ${selectedTitleIds.length - 1} more posts in the background...`,
        })

        // Generate remaining posts
        const remainingPosts = await Promise.all(
          selectedTitleIds.slice(1).map(async (titleId) => {
            try {
              const response = await fetch("/api/generate-post", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ titleId }),
              })
              if (response.ok) {
                const data = await response.json()
                return {
                  id: data.post.id,
                  title: titles.find(t => t.id === titleId)?.title_text || ''
                }
              }
            } catch (error) {
              console.error("Error generating additional post:", error)
            }
            return null
          })
        )

        const validPosts = remainingPosts.filter((post): post is NonNullable<typeof post> => post !== null)
        const allPosts = [...generatedPosts, ...validPosts]
        setGeneratedPosts(allPosts)
        setShowGeneratedDialog(true)

        toast({
          title: "Success",
          description: `Generated ${allPosts.length} blog posts successfully`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate blog content",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle blog content update
  function handleContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setBlogContent(e.target.value)
  }

  // Handle blog save
  async function saveBlog(status: "draft" | "published") {
    if (!currentPostId || !blogContent) {
      toast({
        title: "Error",
        description: "Missing content or post ID",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Update the post with the edited content and status
      const saveResponse = await fetch("/api/save-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: currentPostId,
          content: blogContent,
          status,
        }),
      })

      if (!saveResponse.ok) {
        const error = await saveResponse.json()
        throw new Error(error.error || "Failed to save blog")
      }

      toast({
        title: "Success",
        description: `Blog ${status === "published" ? "published" : "saved as draft"} successfully`,
      })

      router.push("/dashboard/blogs")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save blog",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle topic suggestion click
  function handleTopicSuggestionClick(suggestion: string) {
    topicForm.setValue("topic", suggestion)
  }

  return (
    <>
      <div>
        {/* Steps indicator */}
        <div className="mb-8">
          <div className="relative flex justify-between">
            {steps.map((s, i) => (
              <div key={s.number} className={cn("flex flex-col items-center relative z-10", i < steps.length - 1 && "flex-1")}>
                <div className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold",
                  step >= s.number ? "border-primary bg-primary text-primary-foreground" : "border-muted bg-background"
                )}>
                  {s.number}
                </div>
                <div className="mt-2 text-center">
                  <div className="font-medium">{s.title}</div>
                  <div className="text-sm text-muted-foreground">{s.description}</div>
                </div>
              </div>
            ))}
            {/* Progress bar */}
            <div className="absolute top-5 left-0 right-0 h-[2px] bg-muted -z-10">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step 1: Topic Input */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">What would you like to write about?</h3>
              <Form {...topicForm}>
                <form onSubmit={topicForm.handleSubmit(onTopicSubmit)} className="space-y-6">
                  <FormField
                    control={topicForm.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Digital Marketing Strategies" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <h4 className="text-sm font-medium mb-2">Suggested Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      {suggestedTopics.map((suggestion) => (
                        <Button
                          key={suggestion}
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => handleTopicSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Titles...
                        </>
                      ) : (
                        <>
                          Next
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        )}

        {/* Step 2: Title Selection */}
        {step === 2 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Choose titles for your blogs</h3>
              <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Topic
              </Button>
            </div>

            <p className="text-muted-foreground mb-6">
              We've generated 10 title options based on your topic: <span className="font-medium">{topic}</span>
            </p>

            <div className="space-y-3 mb-6">
              {titles.map((title) => (
                <Card
                  key={title.id}
                  className={`cursor-pointer transition-colors ${title.selected ? "border-primary bg-primary/5" : ""}`}
                  onClick={() => handleTitleSelect(title.id)}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <Checkbox checked={title.selected} onCheckedChange={() => handleTitleSelect(title.id)} />
                    <span className="font-medium">{title.title_text}</span>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end">
              <Button onClick={generateBlog} disabled={selectedTitleIds.length === 0 || isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Blog{selectedTitleIds.length > 1 ? 's' : ''}...
                  </>
                ) : (
                  <>
                    Generate Blog{selectedTitleIds.length > 1 ? 's' : ''}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Blog Content Editor */}
        {step === 3 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Edit your blog content</h3>
              <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Titles
              </Button>
            </div>

            <p className="text-muted-foreground mb-6">
              Your blog has been generated. You can edit the content below before saving.
              {selectedTitleIds.length > 1 && " Additional blogs are being generated in the background."}
            </p>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "write" | "preview")}>
              <TabsList className="mb-4">
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="write">
                <Textarea value={blogContent} onChange={handleContentChange} className="min-h-[500px] font-mono" />
              </TabsContent>
              <TabsContent value="preview">
                <div className="border rounded-md p-4 min-h-[500px] prose dark:prose-invert max-w-none">
                  <MarkdownRenderer content={blogContent} />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" onClick={() => saveBlog("draft")} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save as Draft
              </Button>
              <Button onClick={() => saveBlog("published")} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Publish Blog
              </Button>
            </div>
          </div>
        )}
      </div>

      <GeneratedBlogsDialog
        open={showGeneratedDialog}
        onOpenChange={setShowGeneratedDialog}
        posts={generatedPosts}
      />
    </>
  )
}
