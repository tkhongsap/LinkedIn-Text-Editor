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
    <div className="min-h-screen bg-[#F8F9FF] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-center text-[#0077B5] mb-8">
          LinkedIn Text Editor
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg text-[#0077B5]">Edit Your Text</h2>
              <Button
                onClick={handleAIEnhance}
                variant="ghost"
                className="text-[#0077B5] hover:bg-[#0077B5]/10"
                disabled={isLoading || !text.trim()}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                AI Enhance
              </Button>
            </div>

            <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
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
                        className="h-8 w-8 p-0 hover:bg-white text-gray-600 hover:text-[#0077B5]"
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
              className="min-h-[400px] resize-none border-none focus:ring-0 bg-white text-gray-700"
            />
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg text-[#0077B5]">Preview</h2>
              <Button
                onClick={copyToClipboard}
                variant="ghost"
                className="text-[#0077B5] hover:bg-[#0077B5]/10"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Text
              </Button>
            </div>

            <div className="min-h-[400px] p-4 rounded-lg bg-gray-50">
              {aiSuggestion ? (
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0077B5]/10 text-[#0077B5] text-sm">
                    <Wand2 className="h-3.5 w-3.5" />
                    AI-enhanced suggestion
                  </div>
                  <div className="text-gray-700">{aiSuggestion}</div>
                  <Button 
                    onClick={applySuggestion}
                    className="bg-[#0077B5] text-white hover:bg-[#0077B5]/90"
                  >
                    Apply Suggestion
                  </Button>
                </div>
              ) : (
                <div className="text-gray-700">{text}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

