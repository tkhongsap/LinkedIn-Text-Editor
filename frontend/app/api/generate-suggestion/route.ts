import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = 'edge'

const formatMap = {
  bold: { start: '𝗯', end: '𝘇', offset: 0x1D5D4 },      // Mathematical Bold
  italic: { start: '𝘢', end: '𝘻', offset: 0x1D608 },    // Mathematical Italic
  underline: { start: '͟a', end: '͟z', offset: 0x035F }, // Combining Underline
}

function formatForLinkedIn(text: string): string {
  // Format bold text (**text**)
  text = text.replace(/\*\*(.+?)\*\*/g, (_: string, content: string) => {
    return content.split('').map((char: string) => {
      const code = char.charCodeAt(0)
      if (code >= 97 && code <= 122) { // lowercase letters
        return String.fromCharCode(code - 97 + formatMap.bold.offset)
      }
      if (code >= 65 && code <= 90) { // uppercase letters
        return String.fromCharCode(code - 65 + formatMap.bold.offset)
      }
      return char
    }).join('')
  })

  // Format italic text (_text_)
  text = text.replace(/_(.+?)_/g, (_: string, content: string) => {
    return content.split('').map((char: string) => {
      const code = char.charCodeAt(0)
      if (code >= 97 && code <= 122) { // lowercase letters
        return String.fromCharCode(code - 97 + formatMap.italic.offset)
      }
      if (code >= 65 && code <= 90) { // uppercase letters
        return String.fromCharCode(code - 65 + formatMap.italic.offset)
      }
      return char
    }).join('')
  })

  // Format underlined text (__text__)
  text = text.replace(/__(.+?)__/g, (_: string, content: string) => {
    return content.split('').map((char: string) => {
      const code = char.charCodeAt(0)
      if (code >= 97 && code <= 122) { // lowercase letters
        return char + formatMap.underline.start
      }
      if (code >= 65 && code <= 90) { // uppercase letters
        return char + formatMap.underline.start
      }
      return char
    }).join('')
  })

  // Format bullet points
  text = text.replace(/^\*\s+(.+)$/gm, '• $1')
  text = text.replace(/^-\s+(.+)$/gm, '• $1')

  // Format numbered lists (preserve original numbers)
  text = text.replace(/^(\d+)\.\s+(.+)$/gm, '$1. $2')

  // Add extra newlines between sections for better readability
  text = text.replace(/\n\n/g, '\n\n')

  return text
}

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    stream: true,
    messages: [
      {
        role: 'system',
        content: `You are an AI assistant that enhances LinkedIn posts for maximum engagement. Analyze the content and apply strategic formatting to make it more visually appealing and impactful. Follow these guidelines:

1. Content Analysis:
- Identify key points, statistics, achievements, or compelling statements
- Look for opportunities to break up long paragraphs
- Identify areas that need emphasis or highlighting

2. Formatting Rules:
- Use **text** for important terms, key concepts, and metrics
- Use _text_ for emphasis and industry terms
- Use __text__ sparingly for critical points and calls-to-action
- Use bullet points (*) for lists and features
- Use numbers (1., 2., etc.) for steps and priorities

3. Structure Enhancement:
- Break long paragraphs into shorter sections
- Ensure proper spacing between sections
- Create a clear visual hierarchy

Maintain the original message and tone while making the content more engaging and easier to read.`
      },
      {
        role: 'user',
        content: prompt
      }
    ],
  })

  const chunks = []
  for await (const chunk of stream) {
    chunks.push(chunk.choices[0]?.delta?.content || '')
  }

  const formattedText = formatForLinkedIn(chunks.join(''))
  return new Response(formattedText)
}

