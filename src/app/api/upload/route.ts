import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${Date.now()}-${file.name}`;
  const filepath = path.join(process.cwd(), "public", "uploads", filename);

  await writeFile(filepath, buffer);

  const meeting = await prisma.meeting.create({
    data: {
      title: file.name,
      audioFilePath: `/uploads/${filename}`,
    },
  });

  return NextResponse.json({ success: true, meeting });
}