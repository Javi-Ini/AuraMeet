import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { prisma } from "@/lib/prisma";

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  const { meetingId } = await request.json();

  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
  });

  if (!meeting) {
    return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
  }

  const audioPath = path.join(process.cwd(), "public", meeting.audioFilePath);
  const outputDir = path.join(process.cwd(), "public", "uploads");

  const whisperPath = "/Users/javi_iniguez/Library/Python/3.9/bin/whisper";

  const { stdout, stderr } = await execAsync(
    `${whisperPath} "${audioPath}" --model base --output_format txt --output_dir "${outputDir}"`
  );

  const txtFile = audioPath.replace(/\.[^/.]+$/, ".txt");
  const fs = await import("fs/promises");
  const transcription = await fs.readFile(txtFile, "utf-8");

  const updated = await prisma.meeting.update({
    where: { id: meetingId },
    data: { transcription },
  });

  return NextResponse.json({ success: true, meeting: updated });
}