import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.REMOVE_BG_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured", code: "MISSING_API_KEY" },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body", code: "INVALID_FILE" },
      { status: 400 }
    );
  }

  const imageFile = formData.get("image_file") as File | null;

  if (!imageFile) {
    return NextResponse.json(
      { error: "No image file provided", code: "INVALID_FILE" },
      { status: 400 }
    );
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(imageFile.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Please upload JPG, PNG, or WebP.", code: "INVALID_FILE" },
      { status: 400 }
    );
  }

  const maxSize = 12 * 1024 * 1024; // 12MB
  if (imageFile.size > maxSize) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 12MB.", code: "FILE_TOO_LARGE" },
      { status: 400 }
    );
  }

  try {
    const removeBgForm = new FormData();
    removeBgForm.append("image_file", imageFile);
    removeBgForm.append("size", "auto");

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: removeBgForm,
    });

    if (!response.ok) {
      const errorBody = await response.text();

      if (response.status === 402) {
        return NextResponse.json(
          { error: "API credits exhausted. Please try again later.", code: "RATE_LIMIT" },
          { status: 429 }
        );
      }
      if (response.status === 429) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later.", code: "RATE_LIMIT" },
          { status: 429 }
        );
      }
      if (response.status === 400) {
        return NextResponse.json(
          { error: "Image could not be processed. Please try a different image.", code: "INVALID_FILE" },
          { status: 400 }
        );
      }

      console.error("remove.bg API error:", response.status, errorBody);
      return NextResponse.json(
        { error: "Background removal failed. Please try again.", code: "API_ERROR" },
        { status: 502 }
      );
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Length": imageBuffer.byteLength.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again.", code: "API_ERROR" },
      { status: 500 }
    );
  }
}
