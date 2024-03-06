import type { Context } from "@netlify/functions";
import connection from "@netlify/planetscale";

export default async (request: Request, context: Context) => {
  console.log("Netlify.env", Netlify.env.get("PLANETSCALE_HOST"));
  console.log("process.env", process.env.PLANETSCALE_HOST);
  const { rows: users } = await connection.execute("SELECT * FROM  User");
  return Response.json({
    users,
  });
};
