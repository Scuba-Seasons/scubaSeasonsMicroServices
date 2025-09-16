import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { json } from "@shared/utils.ts";

console.info('[hello] server started');

interface IRequestPayload {
  name: string;
}

/**
 * A simple hello function that greets the user by name.
 * It accepts both GET and POST requests.
 * For GET requests, it expects a `name` query parameter.
 * For POST requests, it expects a JSON body with a `name` field.
 * If the `name` parameter is missing, it returns a 400 error.
 * If the request method is not GET or POST, it returns a 405 error.
 * Returns a JSON response with a greeting message.
 * Example response:
 * { ok: true, data: { message: "Hello John!" } }
 * or if there is an error:
 * { ok: false, message: "error message" }
 * @param req 
 * @returns 
 */
export const handler = async (req: Request) => {
  try {
    let name: string | undefined;

    if (req.method === "GET") {
      const url = new URL(req.url);
      name = url.searchParams.get("name") ?? undefined;
    } else if (req.method === "POST") {
      const body: IRequestPayload = await req.json();
      name = body.name;
    } else {
      return json({ ok: false, message: "Method Not Allowed" }, 405);
    }

    if (!name) throw new Error("Missing 'name'");
    const data = {
      message: `Hello ${name}! version-1`,
    };
    return json({ ok: true, data });
  } catch (err: any) {
    console.error('[hello] error:', err);
    return json({ ok: false, message: err?.message ?? String(err) }, 500);
  }
};

Deno.serve(handler);