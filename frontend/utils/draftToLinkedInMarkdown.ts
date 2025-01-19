import { RawDraftContentState } from 'draft-js'

export function draftToLinkedInMarkdown(rawContent: RawDraftContentState): string {
  return rawContent.blocks.map(block => {
    let text = block.text
    const inlineStyles = block.inlineStyleRanges

    // Sort inline styles by offset in descending order
    inlineStyles.sort((a, b) => b.offset - a.offset)

    // Apply inline styles
    for (let style of inlineStyles) {
      const prefix = getStylePrefix(style.style)
      const suffix = getStyleSuffix(style.style)
      text = text.slice(0, style.offset) + prefix + text.slice(style.offset, style.offset + style.length) + suffix + text.slice(style.offset + style.length)
    }

    // Apply block styles
    switch (block.type) {
      case 'unordered-list-item':
        return '• ' + text
      case 'ordered-list-item':
        return '1. ' + text
      default:
        return text
    }
  }).join('\n\n')
}

function getStylePrefix(style: string): string {
  switch (style) {
    case 'BOLD':
      return '**'
    case 'ITALIC':
      return '_'
    case 'UNDERLINE':
      return '__'
    default:
      return ''
  }
}

function getStyleSuffix(style: string): string {
  return getStylePrefix(style)
}

