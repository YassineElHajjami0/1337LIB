import { categories } from "../../data";
import mysql from "mysql2/promise";

export async function GET() {
  const connection = await mysql.createConnection({
    host: "sql7.freesqldatabase.com",
    user: "sql7741502",
    password: "gPwvJtmfVc",
    database: "sql7741502",
  });

  try {
    const [categories] = await connection.execute("SELECT * FROM categories");
    console.log("categories>>>>", categories);

    return new Response(JSON.stringify(categories), {
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

  // return new Response(JSON.stringify(categories), {
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });
}
