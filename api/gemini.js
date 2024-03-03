import { geminiAIConfig } from "../config/gemini_config"
import { GoogleGenerativeAI } from "@google/generative-ai"

export const fetchResponse = async (prompt, setLoading) => {
    try {
        setLoading(true)
        console.log(prompt)
        const model = new GoogleGenerativeAI(geminiAIConfig.apiKey)
        const genAI = model.getGenerativeModel({ model: geminiAIConfig.textModel })
        const response = await genAI.generateContent(prompt);
        return response.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (error) {
        console.log(error)
    }
    finally {
        setLoading(false)
    }
}