import database from "infra/database";
import orchestrator from "test/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("DROP SCHEMA public CASCADE;");
  await database.query("CREATE SCHEMA public;");
});

test("POST to /api/v1/migrations should return 200", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  const response1Body = await response1.json();

  expect(response1.status).toBe(201);

  expect(Array.isArray(response1Body)).toBe(true);

  expect(response1Body.length).toBeGreaterThan(0);
  expect(response1Body[0].path).toMatch(`infra/migrations`);

  let name = "";
  for (let i = 0; i < response1Body.length; i++) {
    name = response1Body[i].name;
    expect(response1Body[i].path).toMatch(`infra/migrations/${name}.js`);
  }

  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  const response2Body = await response2.json();

  expect(response2.status).toBe(200);

  expect(Array.isArray(response2Body)).toBe(true);
  expect(response2Body.length).toBe(0);
});
