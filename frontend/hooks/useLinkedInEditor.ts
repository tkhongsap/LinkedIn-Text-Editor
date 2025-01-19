import { useState, useCallback } from 'react'

// RTF control words for formatting
const RTF_FORMAT = {
  bold: { start: '\\b ', end: '\\b0 ' },
  italic: { start: '\\i ', end: '\\i0 ' },
  underline: { start: '\\ul ', end: '\\ul0 ' }
}

export function useLinkedInEditor() {
  const [text, setText] = useState('')

  const applyFormat = useCallback((format: string) => {
    const textarea = document.querySelector('textarea')
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = text.substring(start, end)
    
    if (selectedText) {
      let formattedSelection = selectedText

      switch (format) {
        case 'bold':
        case 'italic':
        case 'underline':
          formattedSelection = `${RTF_FORMAT[format].start}${selectedText}${RTF_FORMAT[format].end}`
          break
        case 'bullet':
          formattedSelection = selectedText.split('\n')
            .map(line => `\\listtext\\bullet\\tab ${line}\\par`)
            .join('\n')
          break
        case 'number':
          formattedSelection = selectedText.split('\n')
            .map((line, i) => `\\listtext${i + 1}.\\tab ${line}\\par`)
            .join('\n')
          break
        case 'link':
          const url = prompt('Enter the URL:')
          if (url) {
            // LinkedIn specific hyperlink format
            formattedSelection = `\\field{\\*\\fldinst HYPERLINK "${url}"}{\\fldrslt ${selectedText}}`
          }
          break
        case 'quote':
          formattedSelection = selectedText.split('\n')
            .map(line => `\\quotation ${line}\\par`)
            .join('\n')
          break
      }

      const newText = text.substring(0, start) + formattedSelection + text.substring(end)
      setText(newText)

      // Restore selection
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start, start + formattedSelection.length)
      }, 0)
    }
  }, [text])

  const copyToClipboard = useCallback(() => {
    // Wrap the text in proper RTF document structure before copying
    const rtfDocument = `{\\rtf1\\ansi\n${text}\n}`
    
    navigator.clipboard.writeText(rtfDocument)
      .then(() => {
        alert('Formatted text copied to clipboard!')
      })
      .catch(err => {
        console.error('Failed to copy: ', err)
      })
  }, [text])

  return {
    text,
    setText,
    applyFormat,
    copyToClipboard
  }
}

