"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { LoadingState } from "@/components/ui/loading-state"
import { Progress } from "@/components/ui/progress"

const formSchema = z.object({
  topic: z.string().min(1, { message: "Topic is required" }),
})

type BlogTitle = {
  id: string
  title: string
  selected: boolean
}

export function CreateBlogForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false)
  const [isGeneratingBlogs, setIsGeneratingBlogs] = useState(false)
  const [generatedTitles, setGeneratedTitles] = useState<BlogTitle[]>([])
  const [generationProgress, setGenerationProgress] = useState(0)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGeneratingTitles(true)
    setGeneratedTitles([])

    try {
      // TODO: Implement AI title generation
      // This is a mock response
      const mockTitles = Array.from({ length: 10 }, (_, i) => ({
        id: `title-${i}`,
        title: `Example Blog Title ${i + 1} about ${values.topic}`,
        selected: false,
      }))
      
      setGeneratedTitles(mockTitles)
      toast({
        title: "Success",
        description: "Generated blog title suggestions.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate titles. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingTitles(false)
    }
  }

  async function generateSelectedBlogs() {
    const selectedTitles = generatedTitles.filter(t => t.selected)
    if (selectedTitles.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one title to generate blogs.",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingBlogs(true)
    setGenerationProgress(0)

    try {
      // TODO: Implement batch blog generation
      for (let i = 0; i < selectedTitles.length; i++) {
        // Simulate blog generation progress
        await new Promise(resolve => setTimeout(resolve, 1000))
        setGenerationProgress(((i + 1) / selectedTitles.length) * 100)
      }

      toast({
        title: "Success",
        description: `Generated ${selectedTitles.length} blog posts successfully.`,
      })
      router.push("/dashboard/blogs")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate blogs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingBlogs(false)
      setGenerationProgress(0)
    }
  }

  function toggleTitleSelection(titleId: string) {
    setGeneratedTitles(prev =>
      prev.map(title =>
        title.id === titleId ? { ...title, selected: !title.selected } : title
      )
    )
  }

  const selectedCount = generatedTitles.filter(t => t.selected).length

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What would you like to write about?</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter a topic (e.g., 'productivity tips for remote work')" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isGeneratingTitles || isGeneratingBlogs}>
            {isGeneratingTitles ? (
              <LoadingState size="sm" text="Generating titles..." center={false} />
            ) : (
              "Generate Blog Titles"
            )}
          </Button>
        </form>
      </Form>

      {generatedTitles.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Select Blog Titles to Generate</h3>
              <span className="text-sm text-muted-foreground">
                {selectedCount} selected
              </span>
            </div>
            <div className="space-y-2">
              {generatedTitles.map((title) => (
                <div
                  key={title.id}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent"
                >
                  <Checkbox
                    id={title.id}
                    checked={title.selected}
                    onCheckedChange={() => toggleTitleSelection(title.id)}
                  />
                  <label
                    htmlFor={title.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {title.title}
                  </label>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {isGeneratingBlogs && (
                <div className="space-y-2">
                  <Progress value={generationProgress} />
                  <p className="text-sm text-muted-foreground text-center">
                    Generating blogs... {Math.round(generationProgress)}%
                  </p>
                </div>
              )}
              <Button
                className="w-full"
                onClick={generateSelectedBlogs}
                disabled={selectedCount === 0 || isGeneratingBlogs}
              >
                {isGeneratingBlogs ? (
                  <LoadingState size="sm" text="Generating blogs..." center={false} />
                ) : (
                  `Generate ${selectedCount} Blog${selectedCount !== 1 ? 's' : ''}`
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
} 