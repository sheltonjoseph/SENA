import express from 'express';
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY is not set in the environment variables.");
}

const model = new ChatOpenAI({
  openAIApiKey: OPENAI_API_KEY,
  temperature: 0.7,
  modelName: "gpt-3.5-turbo"
});

const dayPlanTemplate = `
You are an AI assistant that helps users plan their perfect workday by suggesting activities and desk types based on their preferences.

User Preferences:
- Location: {location}
- Date: {date}
- Vibe: {vibe}

Strictly follow this JSON output format. If you cannot provide a specific detail, use "N/A". Ensure all fields are present.

{{
  "morning": {{
    "time": "9:00 AM - 12:00 PM",
    "activity": "",
    "location": "",
    "description": ""
  }},
  "afternoon": {{
    "time": "1:00 PM - 4:00 PM",
    "activity": "",
    "location": "",
    "description": ""
  }},
  "evening": {{
    "time": "4:00 PM - 6:00 PM",
    "activity": "",
    "location": "",
    "description": ""
  }}
}}

Only suggest general office areas like:
- "Private Office"
- "Hot Desk"
- "Lounge Area"
- "Meeting Room"
- "Quiet Zone"
- "Cafe Area"
- "Standing Desk"
- "Collaborative Zone"

Avoid using specific room names like "Desk B3". Give brief, helpful descriptions.
`;

const dayPlanPrompt = new PromptTemplate({
  template: dayPlanTemplate,
  inputVariables: ["location", "date", "vibe"]
});

const dayPlanChain = dayPlanPrompt.pipe(model);

const generateDayPlan = async (req, res) => {
  try {
    const { location, date, vibe } = req.body;

    if (!location || !date || !vibe) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: location, date, or vibe"
      });
    }

    const response = await dayPlanChain.invoke({ location, date, vibe });

    const jsonMatch = response.content.match(/```json\\n([\s\S]*?)```/) ||
                      response.content.match(/```([\s\S]*?)```/);
    const jsonText = jsonMatch ? jsonMatch[1] : response.content;

    const parsed = JSON.parse(jsonText);

    res.json({
      success: true,
      data: parsed
    });
  } catch (error) {
    console.error("Error generating day plan:", error.message || error);
    res.status(500).json({
      success: false,
      error: "Failed to generate day plan"
    });
  }
};

router.post('/generate', generateDayPlan);

export default router; 