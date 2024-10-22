import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Replace these values with your actual database credentials
const DB_CONFIG = {
  host: "sql7.freesqldatabase.com",
  user: "sql7739895",
  password: "kcCnAhJWWX",
  database: "sql7739895",
};

const ADMIN_CREDENTIALS = {
  name: "admin", // Change this to your admin name
  password: "yassine123", // Change this to your admin password
};

export async function GET() {
  return NextResponse.json(
    {
      message: "Login successful",
      token: "aqLPsHr7dYcG0Sd8JvRjGPakZqAtIeat2IZ4PA72VkOo893I9kC0D5kScWgp03k9",
    },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { name, password } = await req.json(); // Assuming your frontend sends JSON

    // Validate the credentials
    if (
      name !== ADMIN_CREDENTIALS.name ||
      password !== ADMIN_CREDENTIALS.password
    ) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: "Login successful",
        token:
          "aqLPsHr7dYcG0Sd8JvRjGPakZqAtIeat2IZ4PA72VkOo893I9kC0D5kScWgp03k9",
      },
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
