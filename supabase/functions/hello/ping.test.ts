import { handler } from "./index.ts";

Deno.test("handler returns hello message with GET and name param", async () => {
  const req = new Request("http://localhost/?name=Vlad", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const res = await handler(req);

  if (res.status !== 200) throw new Error(`expected 200, got ${res.status}`);

  const body = await res.json();
  if (body.ok !== true) throw new Error(`expected ok=true, got ${JSON.stringify(body)}`);
  if (!body.data || body.data.message !== "Hello Vlad!") {
    throw new Error(`expected message=Hello Vlad!, got ${JSON.stringify(body.data)}`);
  }
});
