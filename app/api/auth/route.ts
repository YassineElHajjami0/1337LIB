import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

//-------------------------------------
// credentials are public because the DB service is free and it will end in 7 days
//-------------------------------------

const DB_CONFIG = {
  host: "sql7.freesqldatabase.com",
  user: "sql7739895",
  password: "kcCnAhJWWX",
  database: "sql7739895",
};

const ADMIN_CREDENTIALS = {
  name: "admin",
  password: "yassine123",
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
    const { name, password } = await req.json();

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
