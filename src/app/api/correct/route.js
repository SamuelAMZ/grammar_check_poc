import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Call OpenAI's GPT API
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a grammar correction assistant. Given a sentence, return a structured JSON response with the corrected text, errors, and word indexes.

      Format:
      {
        "correctText": "Corrected sentence",
        "errors": [
          { "word": "incorrectWord", "index": wordIndex, "correctWord": "correctWord" }
        ],
        "text": "Original input text"
      }

      Correct the following sentence: "${text}"`,
          },
        ],
        temperature: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Parse OpenAI's response
    const structuredResponse = JSON.parse(
      response.data.choices[0].message.content
    );
    console.log(structuredResponse);

    return NextResponse.json({ ...structuredResponse });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return NextResponse.json(
      { error: "Failed to correct text" },
      { status: 500 }
    );
  }
}
