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

  // Format italic text (_text_)
  text = text.replace(/_(.+?)_/g, (_: string, content: string) => {
    return content.split('').map((char: string) => {
      const code = char.charCodeAt(0)
      if (code >= 97 && code <= 122) { // lowercase letters
        return String.fromCharCode(code - 97 + 0x1D608) // Mathematical italic
      } else if (code >= 65 && code <= 90) { // uppercase letters
        return String.fromCharCode(code - 65 + 0x1D5E4) // Mathematical italic
      }
      return char
    }).join('')
  })

  // Format underlined text (__text__)
  text = text.replace(/__(.+?)__/g, (_: string, content: string) => {
    return content.split('').map((char: string) => {
      return char + '\u0332' // Combining low line
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
        content: `You are an AI assistant that enhances LinkedIn posts for maximum engagement. Analyze the content and apply strategic formatting to make it more visually appealing and impactful. Follow these guidelines:

1. Content Analysis:
- Identify key points, statistics, achievements, or compelling statements
- Look for opportunities to break up long paragraphs
- Identify areas that need emphasis or highlighting

2. Formatting Rules:
- Use **bold** for:
  • Key achievements or metrics
  • Important concepts or terms
  • Attention-grabbing statements
  • Section headers
- Use _italic_ for:
  • Quotes or testimonials
  • Subtle emphasis
  • Industry-specific terms
- Use __underline__ sparingly for:
  • Call-to-actions
  • Critical points
  • Conclusions
- Use bullet points (*) for:
  • Lists of features or benefits
  • Multiple examples
  • Breaking down complex ideas
- Use numbered lists (1., 2., etc.) for:
  • Step-by-step processes
  • Prioritized points
  • Sequential information

3. Structure Enhancement:
- Break long paragraphs into shorter, more digestible sections
- Add clear headings (###) for different sections
- Ensure proper spacing between sections
- Create a clear visual hierarchy

Maintain the original message and tone while making the content more engaging and easier to read. Focus on professional formatting that enhances readability and impact.`
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

