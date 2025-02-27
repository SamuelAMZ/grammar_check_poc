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
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `#instructions
                You are a grammar correction assistant very similar to the service grammarly. I'll give you sentences and your role will be to spot the grammar errors compaired to regular english and return the errors in a JSON format. If there is no errors then return null
                      Format:
                      {
                        "correctText": "Corrected sentence",
                        "errors": [
                          {"word": "incorrectWord", "index": wordIndex, "correctWord":"correctWord" }],
                          "text": "Original input text"
                        }

                #example
                Given input: I don't want to got to school today
                Expected Response: {
                        "correctText": "I don't want to go to school today",
                        "errors": [
                          { "word": "got", "index": 4, "correctWord": "go" }
                        ],
                        "text": "I don't want to got to school today"
                      }

                #input: "${text}"`,
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
    // console.log(structuredResponse);

    return NextResponse.json({ ...structuredResponse });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return NextResponse.json(
      { error: "Failed to correct text" },
      { status: 500 }
    );
  }
}
