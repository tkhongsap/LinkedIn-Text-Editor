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
    <div className="min-h-screen bg-[#f5f3ff]">
      <div className="container mx-auto p-4 sm:p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center bg-gradient-to-r from-[#2d7da5] to-[#68b7d8] bg-clip-text text-transparent">
            LinkedIn Text Editor
          </h1>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Editor Panel */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                <h2 className="text-lg font-semibold text-[#2d7da5]">Edit Your Text</h2>
                <Button
                  onClick={handleAIEnhance}
                  variant="outline"
                  className="text-[#2d7da5] hover:bg-[#e5e7ff] w-full sm:w-auto"
                  disabled={isLoading || !text.trim()}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  {isLoading ? 'Enhancing...' : 'AI Enhance'}
                </Button>
              </div>
              
              <div className="bg-[#f8f9ff] rounded-lg p-2 sm:p-3 flex flex-wrap gap-2 border border-[#e5e7ff]">
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
                          className="hover:bg-[#e5e7ff] text-[#2d7da5]"
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
                className="min-h-[200px] sm:min-h-[400px] resize-none rounded-lg border-[#e5e7ff] focus:border-[#2d7da5] focus:ring-[#2d7da5]/20"
                placeholder="Type your post here..."
              />
            </div>

            {/* Preview Panel */}
            <div className="bg-gradient-to-br from-[#f8f9ff] to-white rounded-xl shadow-lg p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                <h2 className="text-lg font-semibold text-[#2d7da5]">Preview</h2>
                <Button
                  onClick={copyToClipboard}
                  variant="ghost"
                  className="text-[#2d7da5] hover:bg-[#e5e7ff] w-full sm:w-auto"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Text
                </Button>
              </div>
              
              <div className="min-h-[200px] sm:min-h-[400px] p-4 rounded-lg border border-[#e5e7ff] bg-white whitespace-pre-wrap overflow-y-auto">
                {aiSuggestion ? (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600">AI-enhanced suggestion:</div>
                    <div>{aiSuggestion}</div>
                    <Button 
                      onClick={applySuggestion} 
                      className="bg-[#2d7da5] text-white hover:bg-[#68b7d8] w-full sm:w-auto"
                    >
                      Apply Suggestion
                    </Button>
                  </div>
                ) : (
                  text
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

