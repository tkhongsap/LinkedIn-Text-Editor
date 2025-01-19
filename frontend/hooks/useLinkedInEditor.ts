import { useState, useCallback } from 'react'

const formatMap = {
  bold: { start: '𝗯', end: '𝘇', offset: 0x1D5D4 },
  italic: { start: '𝘢', end: '𝘻', offset: 0x1D608 },
  underline: { start: '͟a', end: '͟z', offset: 0x035F },
}

export function useLinkedInEditor() {
  const [text, setText] = useState('')

  const applyFormat = useCallback((format: string) => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const selectedText = range.toString()
    
    if (selectedText) {
      let formattedSelection = selectedText

      switch (format) {
        case 'bold':
        case 'italic':
        case 'underline':
          formattedSelection = selectedText
            .split('')
            .map(char => {
              const code = char.charCodeAt(0)
              if (code >= 97 && code <= 122) {
                return String.fromCharCode(code - 97 + formatMap[format].offset)
              }
              return char
            })
            .join('')
          break
        case 'bullet':
          formattedSelection = '• ' + selectedText.split('\n').join('\n• ')
          break
        case 'number':
          formattedSelection = selectedText.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n')
          break
        case 'link':
          const url = prompt('Enter the URL:')
          if (url) {
            formattedSelection = `[${selectedText}](${url})`
          }
          break
        case 'quote':
          formattedSelection = '> ' + selectedText.split('\n').join('\n> ')
          break
      }

      const newText = 
        text.slice(0, range.startOffset) +
        formattedSelection +
        text.slice(range.endOffset)

      setText(newText)
    }
  }, [text])

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Text copied to clipboard!')
    }).catch(err => {
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

