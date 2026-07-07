import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  const { meetingId } = await request.json();

  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
  });

  if (!meeting || !meeting.transcription) {
    return NextResponse.json(
      { error: "Meeting or transcription not found" },
      { status: 404 }
    );
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a meeting notes assistant. Convert raw transcriptions into clean, structured meeting notes in Markdown format. Include: a summary, key topics discussed, action items, and any decisions made. Handle filler words, incomplete sentences, and unclear sections gracefully.`,
      },
      {
        role: "user",
        content: `Here is the raw transcription:\n\n${meeting.transcription}`,
      },
    ],
  });

  const notes = completion.choices[0].message.content;

  const updated = await prisma.meeting.update({
    where: { id: meetingId },
    data: { notes },
  });

  return NextResponse.json({ success: true, meeting: updated });
}