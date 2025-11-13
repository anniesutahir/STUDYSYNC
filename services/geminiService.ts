import { GoogleGenAI } from "@google/genai";

export const getAITip = async (subject?: string): Promise<string> => {
  try {
    // FIX: Initialize the GoogleGenAI client assuming the API key is present.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Provide a concise, actionable study tip for a student studying ${subject || 'any subject'}. The tip should be based on scientific learning techniques. Keep it under 50 words and be encouraging.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text;
    return text || "Couldn't generate a tip right now. Keep up the great work!";
  } catch (error) {
    console.error('Error fetching AI tip:', error);
    throw new Error('Failed to generate AI tip.');
  }
};
