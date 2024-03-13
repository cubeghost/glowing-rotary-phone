import type { Context } from "@netlify/functions";
import connection from "@netlify/planetscale";
import { withAuth0 } from "@netlify/auth0";
import { sendEmail } from "@netlify/emails";

export default async (request: Request, context: Context) => {
  const { rows: users } = await connection.execute("SELECT * FROM  User");
  return Response.json({
    users,
  });
};
