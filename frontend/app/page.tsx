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
    <div className="min-h-screen bg-[#F8F9FF]">
      <nav className="border-b border-gray-100 bg-white/70 backdrop-blur-md fixed w-full z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-medium text-gray-800">
                Elixir
              </h1>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500">Product_Ad_Variant1</span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500"
              >
                Preview
              </Button>
              <Button
                size="sm"
                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
              >
                Export
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-[300px,1fr] gap-6">
            {/* Left Sidebar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-4">
                <div className="bg-[#F3F4FF] rounded-md p-4">
                  <h2 className="text-sm font-medium text-gray-800 mb-2">Scene 1</h2>
                  <p className="text-sm text-gray-600">
                    The scene opens with a close-up of a water drop falling into the water
                  </p>
                  <div className="mt-4">
                    <img 
                      src="/placeholder-image.jpg" 
                      alt="Scene preview" 
                      className="rounded-md w-full h-32 object-cover bg-gray-100"
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 text-gray-600 border-gray-200"
                >
                  Edit in canvas
                </Button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="aspect-video bg-gray-50 w-full">
                {/* Canvas/Preview area */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

