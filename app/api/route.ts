import { books } from "../data";
import { NextRequest, NextResponse } from "next/server";
export const config = {
  api: {
    bodyParser: false, // Disabling bodyParser to manually handle FormData
  },
};

export async function GET() {
  return new Response(JSON.stringify(books), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    // Use the `FormData` API to parse the request body
    const formData = await req.formData();

    // Extract fields from the form data
    const name = formData.get("name")?.toString() || "";
    const author = formData.get("author")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const category = formData.get("category")?.toString() || "";
    const file = formData.get("file") as File;

    console.log("Parsed fields:", { name, author, description, category });
    console.log("Uploaded file:", file);

    // Here you can handle the file upload (e.g., saving to a database or cloud storage)

    return NextResponse.json(
      { message: "Book added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
