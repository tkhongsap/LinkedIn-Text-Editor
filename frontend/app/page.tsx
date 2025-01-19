'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useLinkedInEditor } from '../hooks/useLinkedInEditor'
import { BoldIcon as FormatBold, ItalicIcon as FormatItalic, UnderlineIcon as FormatUnderline, List, ListOrdered, Link, Quote, Copy, Wand2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useCompletion } from 'ai/react'

export default function Home() {
  const { text, setText, applyFormat, copyToClipboard } = useLinkedInEditor()
  const [aiSuggestion, setAiSuggestion] = useState('')
  const { complete, completion, isLoading } = useCompletion({
    api: '/api/generate-suggestion',
  })

  useEffect(() => {
    if (completion) {
      setAiSuggestion(completion)
    }
  }, [completion])

  const handleAIEnhance = async () => {
    if (text.trim()) {
      await complete(text)
    }
  }

  const applySuggestion = () => {
    setText(aiSuggestion)
    setAiSuggestion('')
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-center text-primary mb-8">
          LinkedIn Text Editor
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="bg-card rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg text-primary">Edit Your Text</h2>
              <Button
                onClick={handleAIEnhance}
                variant="ghost"
                className="text-primary hover:bg-primary/10"
                disabled={isLoading || !text.trim()}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                AI Enhance
              </Button>
            </div>

            <div className="flex items-center gap-2 mb-4 p-2 bg-secondary rounded-lg">
              <TooltipProvider>
                {[
                  { icon: FormatBold, format: 'bold', tooltip: 'Bold' },
                  { icon: FormatItalic, format: 'italic', tooltip: 'Italic' },
                  { icon: FormatUnderline, format: 'underline', tooltip: 'Underline' },
                  { icon: List, format: 'bullet', tooltip: 'Bullet List' },
                  { icon: ListOrdered, format: 'number', tooltip: 'Numbered List' },
                  { icon: Link, format: 'link', tooltip: 'Add Link' },
                  { icon: Quote, format: 'quote', tooltip: 'Quote' },
                ].map(({ icon: Icon, format, tooltip }) => (
                  <Tooltip key={format}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-white text-muted-foreground hover:text-primary"
                        onClick={() => applyFormat(format)}
                      >
                        <Icon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>

            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your post here..."
              className="min-h-[400px] resize-none border-none focus:ring-0 bg-card text-foreground"
            />
          </div>

          {/* Preview Panel */}
          <div className="bg-card rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg text-primary">Preview</h2>
              <Button
                onClick={copyToClipboard}
                variant="ghost"
                className="text-primary hover:bg-primary/10"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Text
              </Button>
            </div>

            <div className="min-h-[400px] p-4 rounded-lg bg-secondary">
              {aiSuggestion ? (
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
                    <Wand2 className="h-3.5 w-3.5" />
                    AI-enhanced suggestion
                  </div>
                  <div className="text-foreground">{aiSuggestion}</div>
                  <Button 
                    onClick={applySuggestion}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Apply Suggestion
                  </Button>
                </div>
              ) : (
                <div className="text-foreground">{text}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

