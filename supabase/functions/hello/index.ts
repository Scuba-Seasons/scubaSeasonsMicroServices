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
export const handler = async (req: Request) => {
  try {

    let name: string | undefined;
    console.log('[hello] request method:', req.method);
    if (req.method === "GET") {
      console.log('[hello] handling GET request');
      const url = new URL(req.url);
      name = url.searchParams.get("name") ?? undefined;
    } else if (req.method === "POST") {
      console.log('[hello] handling POST request');
      const body: IRequestPayload = await req.json();
      name = body.name;
    } else {
      return json({ ok: false, message: "Method Not Allowed" }, 405);
    }

    if (!name) throw new Error("Missing 'name'");
    const data = {
      message: `Hello ${name}!`,
    };
    console.log('[hello] response data:', data);
    return json({ ok: true, data });
  } catch (err: any) {
    console.error('[hello] error:', err);
    return json({ ok: false, message: err?.message ?? String(err) }, 500);
  }
};

Deno.serve(handler);