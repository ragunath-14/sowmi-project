import express from "express";
import { askGroq } from "../ai/groq.js";
import { fetchStockNews } from "../services/newsService.js";
import {
  updateNewsVectorStore,
  getNewsVectorStore
} from "../vectordb/faissStore.js";
import { getCompanyProfile } from "../services/companyProfileService.js";
import { getAnalytics } from "../services/analyticsService.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();
router.get("/news", verifyToken, async (req, res) => {

  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter required (?query=Something)" });
    }
    console.log("Fetching The news from News ApI")
    const articles = await fetchStockNews(query);

    // const cleanResponse = articles.map((a, i) => 
    //   `News ${i + 1}:\nTitle: ${a.title}\nSource: ${a.source} \n ImageUrl:${a.imageUrl}\n Date: ${a.datetime}\n
    // Description: ${a.description || "None"}\nURL: ${a.url}`
    // ).join("\n\n");
    res.status(200).json({ news: articles });
  } catch (err) {
    console.error("News error:", err.message);
    res.status(500).json({ error: err.message || "Failed to fetch news" });
  }
});

router.post("/analyze-stock", verifyToken, async (req, res) => {

  try {
    const { query,prompt } = req.body;
    if (!query||!prompt) {
      return res.status(400).json({ error: "Proper Query and prompt is required" });
    }
    
    const profile=await getCompanyProfile(query);
    console.log("The Companies Profile is Fetched :",profile);
    
    const analytics=await getAnalytics(query);
    console.log("The Price is fetched and Analytics is Computed:",analytics);
    await updateNewsVectorStore(query);
    console.log("The News is Updated to vector Store");
    const vectorStore=await getNewsVectorStore();
    console.log("The News Stored vector Db is loaded")

    const results=await vectorStore.similaritySearch(prompt,5);
    console.log("The similairy Serach is Done and Matching Articles is fetched")

    const context = results
      .map((doc, i) => `News ${i + 1}:\n${doc.pageContent}`)
      .join("\n\n");

      const finalPrompt = `
        You are a stock market assistant.

        Use the following news context to answer the question.
        Here I have given the Specific company Profile and also Given the company
        Analytics Documnet Which Contains 1 year worth of daily price analytics
       profile ${JSON.stringify(profile,null,2)} 
       Analytics: ${JSON.stringify(analytics,null,2)}

        Context:
        ${context}

        Question:
        ${prompt}

       Answer in the Format that is adviced 
       Companies Profile: Tell here about the companies overall profile and what it does,
       Analytics: Brefiely Describe the companies analytics and display the analytics in JSON fromat
       note: Important reply in JSON format, 
       Answer: reply to the users question with the data given compute a analytics like an 
       experienced Stock market analyst
       Mandatory Reply for all in JSON Format ---> Important
        `;

    const reply = await askGroq(finalPrompt);
    console.log("The AI generated its Response")
    
    let parsedAnswer;
    try{
      let cleaned=reply.trim();
      cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, "").trim();
      if (cleaned.endsWith("```")) {
        cleaned = cleaned.slice(0, -3).trim();  // Remove closing ```
  }

  parsedAnswer = JSON.parse(cleaned);

  console.log(" Successfully parsed AI response as JSON");
    }
    catch(err){
      console.log("Error Occured:",err);
      parsedAnswer = { rawText: reply.trim() };
    }
    res.json({
      parsedAnswer,
    });
  } catch (err) {
    console.error("Groq error:", err.message);
    res.status(500).json({ error: "AI analysis failed" });
  }
});
export default router;