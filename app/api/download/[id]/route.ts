import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // TODO: Replace with your real storage lookup
    // Example:
    // const audioUrl = await getAudioUrlFromDB(id);

    return NextResponse.json({
      audioUrl: `/audio/${id}.mp3`,
    });
  } catch (err) {
    console.error("Download error:", err);
    return NextResponse.json(
      { error: "Failed to fetch audio" },
      { status: 500 }
    );
  }
}
