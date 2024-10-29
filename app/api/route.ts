import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import mysql from "mysql2/promise";

export async function GET() {
  //-------------------------------------
  // credentials are public because the DB service is free and it will end in 7 days
  //-------------------------------------
  const connection = await mysql.createConnection({
    host: "sql7.freesqldatabase.com",
    user: "sql7741502",
    password: "gPwvJtmfVc",
    database: "sql7741502",
  });

  try {
    const [books] = await connection.execute("SELECT * FROM books");
    console.log("books>>>>", books);

    return new Response(JSON.stringify(books), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error(">>>>>>", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } finally {
    await connection.end();
  }
}

export async function POST(req: NextRequest) {
  try {
    // Use the `FormData` API to parse the request body
    const formData = await req.formData();

    const name = formData.get("name")?.toString() || "";
    const author = formData.get("author")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const category = formData.get("category")?.toString() || "";
    const file = formData.get("file") as File;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    await fs.writeFile(`./public/images/${file.name}`, buffer);
    const connection = await mysql.createConnection({
      host: "sql7.freesqldatabase.com",
      user: "sql7741502",
      password: "gPwvJtmfVc",
      database: "sql7741502",
    });

    const [result] = await connection.execute(
      "INSERT INTO books (name, author, description, category, cover) VALUES (?, ?, ?, ?, ?)",
      [
        name,
        author,
        description,
        category,
        `https://1337-lib.vercel.app/images/${file.name}`,
      ]
    );
    const [books] = await connection.execute("SELECT * FROM books");

    await connection.end();

    return NextResponse.json(
      { message: "Book deleted successfully", books },
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

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();

    const id = formData.get("id")?.toString() || ""; // Get the book ID
    const name = formData.get("name")?.toString() || "";
    const author = formData.get("author")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const category = formData.get("category")?.toString() || "";
    const file = formData.get("file") as File | null;

    console.log("Parsed fields:", { id, name, author, description, category });
    console.log("Uploaded file:", file);

    const connection = await mysql.createConnection({
      host: "sql7.freesqldatabase.com",
      user: "sql7741502",
      password: "gPwvJtmfVc",
      database: "sql7741502",
    });

    // SQL update
    let updateQuery =
      "UPDATE books SET name = ?, author = ?, description = ?, category = ?";
    const values = [name, author, description, category];

    // Handle file upload if a new file is provided
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      const filePath = `./public/images/${file.name}`;
      await fs.writeFile(filePath, buffer);

      const fileUrl = `https://1337-lib.vercel.app/images/${file.name}`;
      updateQuery += ", cover = ?";
      values.push(fileUrl);
    }

    updateQuery += " WHERE id = ?";
    values.push(id);

    // Execute the update statement
    const [result] = await connection.execute(updateQuery, values);

    const [books] = await connection.execute("SELECT * FROM books");

    await connection.end();

    return NextResponse.json(
      { message: "Book updated successfully", books },
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

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json(); // Get the book id from the request body

    const connection = await mysql.createConnection({
      host: "sql7.freesqldatabase.com",
      user: "sql7741502",
      password: "gPwvJtmfVc",
      database: "sql7741502",
    });

    await connection.execute("DELETE FROM books WHERE id = ?", [id]);

    const [books] = await connection.execute("SELECT * FROM books");

    await connection.end();

    return NextResponse.json(
      { message: "Book deleted successfully", books },
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

// export async function DELETE(req: NextRequest) {
//   try {
//     const { id } = await req.json(); // Get the book id from the request body

//     const connection = await mysql.createConnection({
//       host: "sql7.freesqldatabase.com",
//       user: "sql7739895",
//       password: "kcCnAhJWWX",
//       database: "sql7739895",
//     });

//     const [result] = await connection.execute(
//       "DELETE FROM books WHERE id = ?",
//       [id]
//     );

//     await connection.end();

//     return NextResponse.json(
//       { message: "Book deleted successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error processing request:", error);
//     return NextResponse.json(
//       { error: "An error occurred while processing the request" },
//       { status: 500 }
//     );
//   }
// }
