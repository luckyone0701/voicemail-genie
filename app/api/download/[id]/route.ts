import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing id" },
        { status: 400 }
      );
    }

    // TODO: Replace with real storage / DB lookup
    // const audioUrl = await getAudioUrl(id);

    return NextResponse.json({
      audioUrl: `/audio/${id}.mp3`,
    });
  } catch (error) {
    console.error("Download route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch audio" },
      { status: 500 }
    );
  }
}
