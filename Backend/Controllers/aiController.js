import { OpenAI } from "openai";

// Creating AI client using HuggingFace Router
const aiClient = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

const AiController = {
  /* 
     Route:
     POST /api/ai/parse
     Expected Body from Frontend:
     { "text": "Today I received 1000 from my mom. Then I ate pizza of 200." }

     AI should return structured data in this format:
     {
       "transactions": [
         {
           "type": "income" or "expense",
           "amount": 200,
           "category": "Food",
           "description": "Ate pizza",
           "paymentMethod": null,
           "confidence": 0.94
         }
       ]
     }
  */

  // POST /api/ai/parse
  parseTransaction: async (req, res) => {
    const { text } = req.body;

    try {
      // Prompt Sent to AI Model
      const prompt = `
            You are a finance assistant.

            Extract ALL financial events from the text below.

            Return ONLY valid JSON in this exact format:

            {
              "transactions": [
                {
                  "type": "income or expense",
                  "amount": number,
                  "category": string,
                  "description": string,
                  "paymentMethod": "cash | card | upi | bank | null",
                  "confidence": number between 0 and 1
                }
              ]
            }

            Text:
            """ ${text} """
            `;

      // Sending Prompt to HuggingFace mMdel
      const response = await aiClient.chat.completions.create({
        model: "meta-llama/Llama-3.1-8B-Instruct:sambanova",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      });

      // Raw Response from AI
      const raw = response.choices[0].message.content;
      console.log("This is Raw AI Response ", raw);

      let parsed;

      // Convert AI Text Response to JSON
      try {
        parsed = JSON.parse(raw);
      } catch (error) {
        return res.status(400).json({
          message: "AI returned invalid JSON",
          raw,
        });
      }

      // Validate AI Response Format
      if (!parsed.transactions || !Array.isArray(parsed.transactions)) {
        return res.status(400).json({
          message: "Invalid AI response format",
          raw,
        });
      }

      // Send Parsed Transactions Back to Frontend
      return res.status(200).json(parsed);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "AI Processing Error" });
    }
  },
};

export default AiController;
