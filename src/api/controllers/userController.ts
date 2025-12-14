import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { usersTable } from "@/db/schema/users";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

export default async function userController(fastify: FastifyInstance) {
  // GET /api/v1/users
  fastify.get(
    "/",
    async function (_request: FastifyRequest, reply: FastifyReply) {
      const users = await db
        .select({
          id: usersTable.id,
          first_name: usersTable.first_name,
          last_name: usersTable.last_name,
          email: usersTable.email,
        })
        .from(usersTable);
      reply.send(users);
    }
  );

  // GET /api/v1/users/:id
  fastify.get(
    "/:id",
    async function (
      _request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) {
      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, parseInt(_request.params.id)));

      if (!user) {
        reply.status(404).send({ message: "User not found" });
        return;
      }

      reply.send(user);
    }
  );
}
