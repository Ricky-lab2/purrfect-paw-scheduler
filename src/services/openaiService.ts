
interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

const SYSTEM_PROMPT = `You are Purrfect Paw's AI veterinary assistant. You provide helpful, accurate information about pet care, health, and veterinary services. 

Guidelines:
- Only answer pet and animal-related questions
- Provide helpful, educational information about pet care
- For serious medical concerns, always recommend consulting with a veterinarian
- Be friendly and supportive
- If asked non-pet related questions, politely redirect to pet topics
- Include relevant information about Purrfect Paw clinic when appropriate (located in Baguio City, Philippines)
- Emergency contact: (123) 456-7890

Keep responses concise but informative.`;

export async function callOpenAI(userMessage: string, apiKey: string): Promise<string> {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  const messages: OpenAIMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userMessage }
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenAI API key.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response. Please try again.';
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to connect to OpenAI. Please check your internet connection and try again.');
  }
}
