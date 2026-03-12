import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { InferenceClient } from "@huggingface/inference";


export async function POST(request: NextRequest) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const { base64File, mediaType } = await request.json();

  // Step 1 — Gemini reads the floor plan
  try {
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mediaType,
          data: base64File,
        },
      },
      {
        text: `Analyze this architectural floor plan and describe:
    - All rooms and their approximate sizes
    - How rooms connect to each other
    - Location of doors and windows
    - Overall layout style (open plan, traditional, etc.)
    Keep the description detailed but concise.`,
      },
    ]);
    const description = result.response.text();
    const prompt = `photorealistic 3D architectural interior render, 
    ${description}, 
    professional visualization, natural lighting, 
    4K quality, architectural digest style, 
    highly detailed, modern interior design`;
    try {
      // Step 3 — Hugging Face FLUX generates the image
      const hf = new InferenceClient(process.env.HF_API_KEY || "");

      const imageBlob = await hf.textToImage({
        model: "black-forest-labs/FLUX.1-schnell",
        inputs: prompt,
        provider: "auto",
      });

      const arrayBuffer = await (imageBlob as Blob).arrayBuffer();
      const base64Image = Buffer.from(arrayBuffer).toString("base64");
      return NextResponse.json({ image: base64Image }, { status: 200 });
    } catch (error) {
      console.error("Error generating image:", error);
      return NextResponse.json(
        { error: "Failed to generate image" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error analyzing floor plan:", error);
    return NextResponse.json(
      { error: "Failed to analyze floor plan" },
      { status: 500 }
    );
  }
  
}
