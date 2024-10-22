import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import mysql from "mysql2/promise";

export const config = {
  api: {
    bodyParser: false, // Disabling bodyParser to manually handle FormData
  },
};

// export async function GET() {
//   return new Response(JSON.stringify(books), {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }

export async function GET() {
  // credentials are public because the DB server is free and it will end in 7 days
  const connection = await mysql.createConnection({
    host: "sql7.freesqldatabase.com",
    user: "sql7739895",
    password: "kcCnAhJWWX",
    database: "sql7739895",
  });

  try {
    // Query the database to retrieve book data
    const [books] = await connection.execute("SELECT * FROM books");
    console.log("books>>>>>>>>>>>>>>", books);

    // Return the data as JSON response
    return new Response(JSON.stringify(books), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error(">>>>>>>>>>>>>>", error);
    // Handle any error and return a 500 response
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } finally {
    // Close the database connection
    await connection.end();
  }
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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    await fs.writeFile(`./public/images/${file.name}`, buffer);

    // revalidatePath("/");

    // Here you can handle the file upload (e.g., saving to a cloud storage)

    // Establish a connection to the MySQL database
    const connection = await mysql.createConnection({
      host: "sql7.freesqldatabase.com",
      user: "sql7739895",
      password: "kcCnAhJWWX",
      database: "sql7739895",
    });

    // Prepare and execute the insert statement
    const [result] = await connection.execute(
      "INSERT INTO books (name, author, description, category, cover) VALUES (?, ?, ?, ?, ?)",
      [
        name,
        author,
        description,
        category,
        `http://localhost:3000/images/${file.name}`,
      ] // Replace with the actual file URL after uploading
    );

    // Close the database connection
    await connection.end();

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

export async function PUT(req: NextRequest) {
  try {
    // Use the `FormData` API to parse the request body
    const formData = await req.formData();

    // Extract fields from the form data
    const id = formData.get("id")?.toString() || ""; // Get the book ID
    const name = formData.get("name")?.toString() || "";
    const author = formData.get("author")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const category = formData.get("category")?.toString() || "";
    const file = formData.get("file") as File;

    console.log("Parsed fields:", { id, name, author, description, category });
    console.log("Uploaded file:", file);

    // Establish a connection to the MySQL database
    const connection = await mysql.createConnection({
      host: "sql7.freesqldatabase.com",
      user: "sql7739895",
      password: "kcCnAhJWWX",
      database: "sql7739895",
    });

    // Prepare the SQL update statement
    let updateQuery =
      "UPDATE books SET name = ?, author = ?, description = ?, category = ?";
    const values = [name, author, description, category];

    // If a file is uploaded, you may need to handle it and update the cover URL
    if (file) {
      // Logic for uploading the file goes here (e.g., to cloud storage)
      const fileUrl = "url_to_uploaded_file"; // Replace with the actual file URL after uploading
      updateQuery += ", cover = ?";
      values.push(fileUrl);
    }

    // Append the WHERE clause to update the correct book
    updateQuery += " WHERE id = ?";
    values.push(id);

    // Execute the update statement
    const [result] = await connection.execute(updateQuery, values);

    // Close the database connection
    await connection.end();

    return NextResponse.json(
      { message: "Book updated successfully" },
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
    const { id } = await req.json(); // Get the book ID from the request body

    // Establish a connection to the MySQL database
    const connection = await mysql.createConnection({
      host: "sql7.freesqldatabase.com",
      user: "sql7739895",
      password: "kcCnAhJWWX",
      database: "sql7739895",
    });

    // Prepare and execute the delete statement
    const [result] = await connection.execute(
      "DELETE FROM books WHERE id = ?",
      [id]
    );

    // Close the database connection
    await connection.end();

    return NextResponse.json(
      { message: "Book deleted successfully" },
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

// export async function POST(req: NextRequest) {
//   try {
//     // Use the `FormData` API to parse the request body
//     const formData = await req.formData();

//     // Extract fields from the form data
//     const name = formData.get("name")?.toString() || "";
//     const author = formData.get("author")?.toString() || "";
//     const description = formData.get("description")?.toString() || "";
//     const category = formData.get("category")?.toString() || "";
//     const file = formData.get("file") as File;

//     console.log("Parsed fields:", { name, author, description, category });
//     console.log("Uploaded file:", file);

//     // Here you can handle the file upload (e.g., saving to a database or cloud storage)

//     return NextResponse.json(
//       { message: "Book added successfully" },
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

// export async function PUT(req: NextRequest) {
//   try {
//     // Use the `FormData` API to parse the request body
//     const formData = await req.formData();

//     // Extract fields from the form data
//     const id = formData.get("id")?.toString() || ""; // Get the book ID
//     const name = formData.get("name")?.toString() || "";
//     const author = formData.get("author")?.toString() || "";
//     const description = formData.get("description")?.toString() || "";
//     const category = formData.get("category")?.toString() || "";
//     const file = formData.get("file") as File;

//     console.log("Parsed fields:", { id, name, author, description, category });
//     console.log("Uploaded file:", file);

//     // Here you can add logic to find the existing book by ID and update its details
//     // For example, you might interact with a database to perform the update

//     return NextResponse.json(
//       { message: "Book updated successfully" },
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

// export async function DELETE(req: NextRequest) {
//   try {
//     const { id } = await req.json(); // Get the book ID from the request body

//     // Find the index of the book in the books array
//     const index = books.findIndex((book) => book.id === Number(id));

//     if (index === -1) {
//       return NextResponse.json({ error: "Book not found" }, { status: 404 });
//     }

//     // Remove the book from the array
//     books.splice(index, 1);

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
