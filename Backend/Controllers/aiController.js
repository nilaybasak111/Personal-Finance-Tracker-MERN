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

  parseTransaction: async (req, res) => {
    const { text } = req.body;

    try {
      // Prompt Sent to AI Model
      const prompt = `
                  You are a JSON API.

                  Your task is to extract financial transactions from text.

                  You MUST follow these rules:

                  1. Output ONLY valid JSON.
                  2. Do NOT add explanations.
                  3. Do NOT add markdown.
                  4. Do NOT add comments.
                  5. Do NOT add emojis.
                  6. Do NOT add extra text.
                  7. Do NOT wrap in code blocks.
                  8. Use null if data is missing.
                  9. Use only the allowed values.

                  ALLOWED VALUES:

                  type: "income" | "expense"
                  paymentMethod: "cash" | "card" | "upi" | "bank" | "others" | null

                  Return EXACTLY this format:

                  {
                    "transactions": [
                      {
                        "type": "income" | "expense",
                        "amount": number,
                        "category": string,
                        "description": string,
                        "paymentMethod": "cash" | "card" | "upi" | "bank" | "others" | null,
                        "confidence": number
                      }
                    ]
                  }

                  IMPORTANT:
                  - confidence must be between 0 and 1
                  - amount must be a number (no quotes)
                  - category must be lowercase
                  - description must be short and clear
                  - If no transaction is found, return:

                  {
                    "transactions": []
                  }

                  Text:
                  """${text}"""
                  `;

      // Sending Prompt to HuggingFace Model
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
