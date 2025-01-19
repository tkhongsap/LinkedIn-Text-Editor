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
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-white to-[#f0f4ff]">
      <nav className="border-b border-gray-100 bg-white/70 backdrop-blur-md fixed w-full z-10">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#0077B5] to-[#00A0DC] bg-clip-text text-transparent">
              LinkedIn Text Editor
            </h1>
            <Button
              onClick={handleAIEnhance}
              className="bg-gradient-to-r from-[#0077B5] to-[#00A0DC] text-white hover:opacity-90 transition-all duration-200 font-medium px-6"
              disabled={isLoading || !text.trim()}
            >
              <Wand2 className="h-4 w-4 mr-2" />
              {isLoading ? 'Enhancing...' : 'AI Enhance'}
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-28 pb-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Editor Panel */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100/50 overflow-hidden backdrop-blur-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Edit Your Text</h2>
              </div>
              
              <div className="px-5 py-3 bg-gray-50/80 border-b border-gray-100 flex flex-wrap items-center gap-1">
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
                          className="h-8 w-8 rounded-lg hover:bg-white text-gray-600 hover:text-[#0077B5] transition-all duration-200"
                          onClick={() => applyFormat(format)}
                        >
                          <Icon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-800 text-white text-xs">
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
                  className="min-h-[400px] resize-none rounded-lg border-gray-200 focus:border-[#0077B5] focus:ring-[#0077B5]/10 transition-all duration-200 text-gray-700 placeholder:text-gray-400"
                  placeholder="Type your post here..."
                />
              </div>
            </div>

            {/* Preview Panel */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100/50 overflow-hidden backdrop-blur-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Preview</h2>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="border-gray-200 text-gray-600 hover:text-[#0077B5] hover:border-[#0077B5] transition-all duration-200"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Text
                </Button>
              </div>
              
              <div className="p-6">
                <div className="min-h-[400px] p-6 rounded-lg border border-gray-200 bg-gray-50/50 whitespace-pre-wrap overflow-y-auto">
                  {aiSuggestion ? (
                    <div className="space-y-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#0077B5]/10 to-[#00A0DC]/10 text-[#0077B5] text-sm font-medium">
                        <Wand2 className="h-3.5 w-3.5" />
                        AI-enhanced suggestion
                      </div>
                      <div className="text-gray-700 leading-relaxed">{aiSuggestion}</div>
                      <Button 
                        onClick={applySuggestion} 
                        className="bg-gradient-to-r from-[#0077B5] to-[#00A0DC] text-white hover:opacity-90 transition-all duration-200 font-medium"
                      >
                        Apply Suggestion
                      </Button>
                    </div>
                  ) : (
                    <div className="text-gray-700 leading-relaxed">{text}</div>
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

