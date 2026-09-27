import dotenv from "dotenv";
dotenv.config();
import {ChatGroq} from '@langchain/groq'
import axios from 'axios'

const llm= new ChatGroq({
    apiKey:process.env.GROQ_API_KEY,
    model:"openai/gpt-oss-120b",
    temperature: 0.2
})

const askGemini = async (prompt) => {
    const { data } = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        { contents: [{ parts: [{ text: prompt }] }] }
    );
    return data.candidates[0].content.parts[0].text;
}

export const askGroq=async(prompt)=>{
    try{
        const response= await llm.invoke(prompt)
        return response.content;
    }catch(err){
        console.log("Groq failed, falling back to Gemini:", err.message);
        return askGemini(prompt);
    }
}