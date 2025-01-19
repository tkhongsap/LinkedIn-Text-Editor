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
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="border-b bg-white/80 backdrop-blur-sm fixed w-full z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold text-[#0A66C2]">
            LinkedIn Text Editor
          </h1>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Editor Panel */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-lg font-medium text-gray-900">Edit Your Text</h2>
                <Button
                  onClick={handleAIEnhance}
                  className="bg-[#0A66C2] hover:bg-[#004182] text-white transition-all duration-200 shadow-sm w-full sm:w-auto"
                  disabled={isLoading || !text.trim()}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  {isLoading ? 'Enhancing...' : 'AI Enhance'}
                </Button>
              </div>
              
              <div className="px-6 py-3 bg-gray-50/50 border-b border-gray-100 flex flex-wrap gap-1">
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
                          size="icon"
                          className="h-9 w-9 rounded hover:bg-gray-100 text-gray-600 hover:text-[#0A66C2] transition-colors duration-200"
                          onClick={() => applyFormat(format)}
                        >
                          <Icon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900 text-white">
                        <p>{tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>

              <div className="p-6">
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[400px] resize-none rounded border-gray-200 focus:border-[#0A66C2] focus:ring-[#0A66C2]/10 transition-colors duration-200 text-gray-800 placeholder:text-gray-400"
                  placeholder="Type your post here..."
                />
              </div>
            </div>

            {/* Preview Panel */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-lg font-medium text-gray-900">Preview</h2>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="border-gray-200 text-gray-600 hover:text-[#0A66C2] hover:border-[#0A66C2] transition-colors duration-200 shadow-sm w-full sm:w-auto"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Text
                </Button>
              </div>
              
              <div className="p-6">
                <div className="min-h-[400px] p-6 rounded-lg border border-gray-200 bg-gray-50/50 whitespace-pre-wrap overflow-y-auto">
                  {aiSuggestion ? (
                    <div className="space-y-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A66C2]/10 text-[#0A66C2] text-sm font-medium">
                        <Wand2 className="h-3.5 w-3.5" />
                        AI-enhanced suggestion
                      </div>
                      <div className="text-gray-800 leading-relaxed">{aiSuggestion}</div>
                      <Button 
                        onClick={applySuggestion} 
                        className="bg-[#0A66C2] hover:bg-[#004182] text-white transition-all duration-200 shadow-sm w-full sm:w-auto"
                      >
                        Apply Suggestion
                      </Button>
                    </div>
                  ) : (
                    <div className="text-gray-800 leading-relaxed">{text}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

