import { GoogleGenerativeAI } from '@google/generative-ai';

let geminiClient: GoogleGenerativeAI | null = null;

const getGeminiClient = (): GoogleGenerativeAI => {
  if (!geminiClient) {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_GEMINI_API_KEY is not set in environment variables');
    }
    geminiClient = new GoogleGenerativeAI(apiKey);
  }
  return geminiClient;
};

export interface MeetingSummary {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
}

export const generateMeetingSummary = async (
  title: string,
  description: string,
  attendees: string[],
  duration: string
): Promise<MeetingSummary> => {
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are an AI assistant that summarizes meetings. Based on the following meeting details, provide a concise summary:

Meeting Title: ${title}
Description: ${description || 'No description provided'}
Attendees: ${attendees.join(', ') || 'No attendees listed'}
Duration: ${duration}

Please provide:
1. A brief summary (2-3 sentences)
2. Key points discussed (3-5 bullet points)
3. Action items (if any, otherwise state "No specific action items")

Format your response as JSON with this structure:
{
  "summary": "brief summary text",
  "keyPoints": ["point 1", "point 2", ...],
  "actionItems": ["action 1", "action 2", ...]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON from the response
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;
      const parsed = JSON.parse(jsonText.trim());
      
      return {
        summary: parsed.summary || 'Summary generated successfully.',
        keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
        actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
      };
    } catch (parseError) {
      // If JSON parsing fails, return a structured response from text
      return {
        summary: text.substring(0, 200) || 'Summary generated successfully.',
        keyPoints: [],
        actionItems: [],
      };
    }
  } catch (error) {
    console.error('Error generating meeting summary:', error);
    // Return a mock summary on error
    return {
      summary: 'Unable to generate AI summary at this time. Please try again later.',
      keyPoints: [],
      actionItems: [],
    };
  }
};

