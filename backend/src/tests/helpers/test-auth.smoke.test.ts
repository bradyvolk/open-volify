import { describe, it, expect, afterAll } from "bun:test";
import { buildTestServer } from "./test-server";
import { createAuthedUser, deleteTestUser } from "./test-auth";

describe("test auth helpers", () => {
  it("creates a signed-in staff user that can call an authenticated route", async () => {
    const server = await buildTestServer();
    const { user, cookies } = await createAuthedUser(server, "staff");

    const response = await server.inject({
      method: "GET",
      url: "/api/people",
      cookies,
    });

    expect(response.statusCode).toBe(200);

    await deleteTestUser(user.id);
    await server.close();
  });
});
