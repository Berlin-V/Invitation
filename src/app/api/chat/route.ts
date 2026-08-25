import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "fs";
import { join } from "path";

const SYSTEM_CONTEXT = `You are Cupid, a warm and romantic wedding assistant for Berlin & Jerlin Ashika's wedding on December 10, 2026.
You answer questions based on the provided couple information. Be friendly, concise, and add a touch of romance to your answers.
Use occasional heart emojis but don't overdo it.
If asked something not in the information, kindly say you don't have that detail yet but they can reach out to the families.`;

// Per-instance in-memory limiter — caps runaway Gemini usage/cost from a single visitor.
// Resets on server restart / cold start, which is an acceptable tradeoff for this site's traffic.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const requestLog = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(key, recent);
    return true;
  }
  recent.push(now);
  requestLog.set(key, recent);
  return false;
}

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
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({
        reply: "You've reached the chat limit for now — please try again in a bit!",
      });
    }

    const { message, history } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "your_gemini_api_key") {
      return NextResponse.json({
        reply: "The chat assistant isn't configured yet. Please add the Gemini API key to enable this feature!",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      generationConfig: { maxOutputTokens: 220 },
    });

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
