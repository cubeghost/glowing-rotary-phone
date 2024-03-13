import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { withAuth0 } from "@netlify/auth0";
import { IdentityContext } from "@serverless-jwt/netlify";

type Auth0Context = {
  identityContext?: IdentityContext;
};

export const handler: Handler = withAuth0(
  async (event: HandlerEvent, context: Auth0Context) => {
    console.log(context.identityContext);
    return {
      statusCode: 200,
      body: JSON.stringify({ identityContext: context.identityContext }),
    };
  },
  {
    auth0: {
      required: true,
    },
  }
);
