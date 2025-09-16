import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { json } from "@shared/utils.ts";

console.info('[hello] server started');

interface IRequestPayload {
  name: string;
}

/**
 * A simple hello function that returns a greeting message.
 * It expects a query parameter `name`.
 * If the `name` parameter is missing, it returns an error.
 * Example request: /hello?name=Alice
 * Example response: { ok: true, data: { message: "Hello Alice!" } }
 * @param req 
 * @returns 
 */
export const handler = (req: Request) => {
  try {
    const url = new URL(req.url);
    const name = url.searchParams.get("name");

    if (!name) throw new Error("Missing 'name' query parameter");

    const data = {
      message: `Hello ${name}!`,
    };
    return json({ ok: true, data });
  } catch (err: any) {
    return json({ ok: false, message: err?.message ?? String(err) }, 500);
  }
};

Deno.serve(handler);