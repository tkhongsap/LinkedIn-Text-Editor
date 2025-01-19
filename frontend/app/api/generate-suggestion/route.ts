import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

export const runtime = 'edge'

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const response = await openai.createChatCompletion({
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

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}

