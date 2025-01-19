import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = 'edge'

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const stream = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'system',
        content: 'You are an AI assistant that helps improve LinkedIn posts. Enhance the given text by making it more engaging, professional, and suitable for a LinkedIn audience. Maintain the original message and tone, but improve clarity, structure, and impact.'
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

  return new Response(chunks.join(''))
}

