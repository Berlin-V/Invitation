import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "fs";
import { join } from "path";

const SYSTEM_CONTEXT = `You are Cupid, a warm and romantic wedding assistant for Berlin & Jerlin Ashika's wedding on December 10, 2026.
You answer questions based on the provided couple information. Be friendly, concise, and add a touch of romance to your answers.
Use occasional heart emojis but don't overdo it.
If asked something not in the information, kindly say you don't have that detail yet but they can reach out to the families.`;

function getCoupleInfo(): string {
  try {
    const path = join(process.cwd(), "src/lib/couple-info.md");
    return readFileSync(path, "utf-8");
  } catch {
    return "Berlin & Jerlin Ashika wedding on December 10, 2026.";
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "your_gemini_api_key") {
      return NextResponse.json({
        reply: "The chat assistant isn't configured yet. Please add the Gemini API key to enable this feature!",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const coupleInfo = getCoupleInfo();
    const context = `${SYSTEM_CONTEXT}\n\n## Couple Information:\n${coupleInfo}`;

    const chatHistory = (history || [])
      .slice(-6)
      .filter((m: { role: string }) => m.role !== "assistant" || (history || []).indexOf(m) > 0)
      .map((m: { role: string; text: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: context }] },
        { role: "model", parts: [{ text: "Understood! I'm Cupid, ready to help guests with wedding information. 💛" }] },
        ...chatHistory,
      ],
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json({ reply: "I'm having trouble connecting right now. Please try again shortly!" });
  }
}
