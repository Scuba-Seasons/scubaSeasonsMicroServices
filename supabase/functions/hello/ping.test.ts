// supabase/functions/hello/hello.test.ts
import { handler } from "./index.ts";
import { assertEquals, assert, assertMatch } from "jsr:@std/assert";

// Helpers
async function json(res: Response) {
  assert(res.headers.get("content-type")?.includes("application/json"));
  return await res.json();
}

Deno.test("GET /hello?name=Vlad -> 200", async () => {
  const req = new Request("http://local/hello?name=Vlad");
  const res = await handler(req);
  assertEquals(res.status, 200);

  const body = await json(res);
  assertEquals(body.ok, true);
  assertEquals(body.data?.message, "Hello Vlad!");
});

Deno.test("POST /hello { name } -> 200", async () => {
  const req = new Request("http://local/hello", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "Vlad" }),
  });
  const res = await handler(req);
  assertEquals(res.status, 200);

  const body = await json(res);
  assertEquals(body.ok, true);
  assertEquals(body.data?.message, "Hello Vlad!");
});

Deno.test("GET /hello (missing name) -> 500 (current behavior)", async () => {
  const req = new Request("http://local/hello");
  const res = await handler(req);
  assertEquals(res.status, 500);

  const body = await json(res);
  assertEquals(body.ok, false);
  assertMatch(String(body.message), /Missing 'name'/);
});

Deno.test("POST /hello (invalid JSON) -> 500 (current behavior)", async () => {
  const req = new Request("http://local/hello", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{not-json}",
  });
  const res = await handler(req);
  assertEquals(res.status, 500);

  const body = await json(res);
  assertEquals(body.ok, false);
});

Deno.test("PUT /hello -> 405 Method Not Allowed", async () => {
  const req = new Request("http://local/hello", { method: "PUT" });
  const res = await handler(req);
  assertEquals(res.status, 405);

  const body = await json(res);
  assertEquals(body.ok, false);
  assertMatch(String(body.message), /Method Not Allowed/);
});
