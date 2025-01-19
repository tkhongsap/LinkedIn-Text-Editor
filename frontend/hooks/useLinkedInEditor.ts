import { useState, useCallback } from 'react'

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
          formattedSelection = `**${selectedText}**`
          break
        case 'italic':
          formattedSelection = `_${selectedText}_`
          break
        case 'underline':
          formattedSelection = `__${selectedText}__`
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

