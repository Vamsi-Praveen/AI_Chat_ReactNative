import { geminiAIConfig } from "../config/gemini_config"
import { GoogleGenerativeAI } from "@google/generative-ai"


//text response function
export const fetchResponse = async (prompt, setLoading) => {
    try {
        //we are setting the setloading to true for updating the loading function that helps user to know api is generating
        setLoading(true)
        //creating model using apikey stored in config file
        const model = new GoogleGenerativeAI(geminiAIConfig.apiKey)
        const genAI = model.getGenerativeModel({ model: geminiAIConfig.textModel })
        const response = await genAI.generateContent(prompt);
        //response is stored in the place
        return response.response?.candidates?.[0]?.content?.parts?.[0]?.text || 'Try Again';
    } catch (error) {
        console.log(error)
    }
    finally {//after getting the input turnoff the loading
        setLoading(false)
    }
}

//image response function
export const fetchImageResponse = async (image, prompt, setLoading) => {
    try {
        setLoading(true)
        console.log(prompt)
        const model = new GoogleGenerativeAI(geminiAIConfig.apiKey)
        //using google-pro-vision model for image to text generation
        const genAI = model.getGenerativeModel({ model: geminiAIConfig.multiModel })
        const response = await genAI.generateContent([image, prompt])
        return response.response?.candidates?.[0]?.content?.parts?.[0]?.text || 'Try Again';

    } catch (error) {
        console.log(error)
    }
    finally {
        setLoading(false)
    }
}