import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing voicemail id" },
        { status: 400 }
      );
    }

    /**
     * TODO:
     * Replace this with your real lookup:
     *  - database
     *  - S3
     *  - signed URL
     */
    const audioUrl = `/generated/${id}.mp3`;

    return NextResponse.json({ audioUrl });
  } catch (err) {
    console.error("Download error:", err);
    return NextResponse.json(
      { error: "Failed to fetch audio" },
      { status: 500 }
    );
  }
}
