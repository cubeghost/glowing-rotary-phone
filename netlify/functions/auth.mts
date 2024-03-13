import type { Context } from "@netlify/functions";
import {
  JwtVerifier,
  JwtVerifierOptions,
  getTokenFromHeader,
  JwtVerifierError,
  claimToArray,
} from "@serverless-jwt/jwt-verifier";

const checkAuth = async (request: Request) => {
  const verifier = new JwtVerifier({
    issuer: Netlify.env.get("AUTH0_ISSUER")!,
    audience: Netlify.env.get("AUTH0_AUDIENCE")!,
    mapClaims: async (claims) => {
      const user = claims;
      user.scope = claimToArray(
        typeof user.scope === "string" ? user.scope : ""
      );
      return user;
    },
  });

  const accessToken = getTokenFromHeader(
    request.headers.get("Authorization") as string
  );
  const claims = await verifier.verifyAccessToken(accessToken);

  return {
    token: accessToken,
    claims,
  };
};

export default async (request: Request, context: Context) => {
  const { token, claims } = await checkAuth(request);
  const userInfoReq = await fetch(
    new URL("/userinfo", Netlify.env.get("AUTH0_ISSUER")),
    {
      headers: {
        Authorization: request.headers.get("Authorization")!,
      },
    }
  );
  const userInfo = await userInfoReq.json();
  console.log({ userInfo });

  return Response.json({ cool: true });
};
