import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = 'edge'

function formatForLinkedIn(text: string): string {
  // Format headings (###)
  text = text.replace(/^###\s+(.+)$/gm, (_: string, content: string) => {
    return content.split('').map((char: string) => {
      const code = char.charCodeAt(0)
      if (code >= 97 && code <= 122) { // lowercase letters
        return String.fromCharCode(code - 97 + 0x1D5EE) // Mathematical bold sans-serif
      } else if (code >= 65 && code <= 90) { // uppercase letters
        return String.fromCharCode(code - 65 + 0x1D5D4) // Mathematical bold sans-serif
      }
      return char
    }).join('')
  })

  // Format bold text (**text**)
  text = text.replace(/\*\*(.+?)\*\*/g, (_: string, content: string) => {
    return content.split('').map((char: string) => {
      const code = char.charCodeAt(0)
      if (code >= 97 && code <= 122) { // lowercase letters
        return String.fromCharCode(code - 97 + 0x1D5EE) // Mathematical bold sans-serif
      } else if (code >= 65 && code <= 90) { // uppercase letters
        return String.fromCharCode(code - 65 + 0x1D5D4) // Mathematical bold sans-serif
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
  text = text.replace(/\n\n/g, '\n\n\n')

  return text
}

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const stream = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'system',
        content: 'You are an AI assistant that helps improve LinkedIn posts. Format your response using markdown with these rules:\n- Use ### for headings\n- Use **text** for bold text\n- Use bullet points (* or -) for lists\n- Use numbered lists (1., 2., etc.) where appropriate\nEnhance the given text by making it more engaging, professional, and suitable for a LinkedIn audience. Maintain the original message and tone, but improve clarity, structure, and impact.'
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

