import { useState, useCallback } from 'react'

const formatMap = {
  bold: { start: '𝗯', end: '𝘇', offset: 0x1D5D4 },
  italic: { start: '𝘢', end: '𝘻', offset: 0x1D608 },
  underline: { start: '͟a', end: '͟z', offset: 0x035F },
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
          formattedSelection = selectedText
            .split('')
            .map(char => {
              const code = char.charCodeAt(0)
              if (code >= 97 && code <= 122) { // lowercase letters
                return String.fromCharCode(code - 97 + formatMap[format].offset)
              }
              if (code >= 65 && code <= 90) { // uppercase letters
                return String.fromCharCode(code - 65 + formatMap[format].offset)
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
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Text copied to clipboard!')
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

