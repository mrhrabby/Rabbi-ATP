
import { GoogleGenAI } from "@google/genai";

export const generateAIDescription = async (title: string, category: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, engaging description in Bengali for a content piece titled "${title}" in the category of "${category}". The tone should be professional yet appealing. Limit to 150 words.`,
    });

    return response.text || "দুঃখিত, বর্ণনা তৈরি করা সম্ভব হয়নি।";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI বর্ণনা তৈরিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
  }
};
