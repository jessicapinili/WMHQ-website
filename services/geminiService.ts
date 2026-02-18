
import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client strictly using process.env.API_KEY as per coding guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const refineContent = async (currentText: string, instruction: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Current text: "${currentText}"
      Task: ${instruction}
      Constraint: Keep it high-end, editorial, minimalist, and sophisticated (similar to Vogue, Kinfolk, or Wisprflow). 
      Return ONLY the refined text.`,
    });
    
    // Using the .text property directly as it is a getter, not a method.
    return response.text?.trim() || currentText;
  } catch (error) {
    console.error("Gemini refinement error:", error);
    return currentText;
  }
};
