import type { Context } from "@netlify/edge-functions";
import {
  getTokenFromHeader,
  claimToArray,
} from "https://esm.sh/@serverless-jwt/jwt-verifier";
import * as jose from "https://deno.land/x/jose@v4.9.0/index.ts";

const fetchOIDC = async () => {
  const OIDC_URI = new URL(
    ".well-known/openid-configuration",
    Netlify.env.get("AUTH0_ISSUER")!
  );
  const response = await fetch(OIDC_URI);
  return await response.json();
};

const checkAuth = async (request: Request) => {
  const { jwks_uri } = await fetchOIDC();
  const JWKS = jose.createRemoteJWKSet(new URL(jwks_uri));

  const accessToken = getTokenFromHeader(
    request.headers.get("Authorization") as string
  );
  const { payload } = await jose.jwtVerify(accessToken, JWKS, {
    issuer: Netlify.env.get("AUTH0_ISSUER")!,
    audience: Netlify.env.get("AUTH0_AUDIENCE")!,
  });
  const claims = claimToArray(
    typeof payload.scope === "string" ? payload.scope : ""
  );

  return {
    token: accessToken,
    claims,
  };
};

export default async (request: Request, context: Context) => {
  try {
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
  } catch (err) {
    console.error(err);
    return Response.json({ cool: false });
  }
};

export const config = { path: "/me" };
