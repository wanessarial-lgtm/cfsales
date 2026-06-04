import { GoogleGenAI } from "@google/genai";

export function getGeminiKey(): string {
  return (import.meta.env.VITE_GEMINI_API_KEY as string) || localStorage.getItem("cf_gemini_key") || "";
}

export async function generateText(systemPrompt: string, userMessage: string): Promise<string> {
  const apiKey = getGeminiKey();
  if (!apiKey) return "";
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      config: { systemInstruction: systemPrompt, temperature: 0.7 },
      contents: [userMessage],
    });
    return response.text?.trim() || "";
  } catch (e) {
    console.error("Gemini error:", e);
    return "";
  }
}
