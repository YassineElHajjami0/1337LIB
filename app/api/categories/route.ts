import { categories } from "../../data";

export async function GET() {
  return new Response(JSON.stringify(categories), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
