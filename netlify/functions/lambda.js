const { withAuth0 } = require("@netlify/auth0");

exports.handler = withAuth0(
  async function (event, context) {
    return {
      statusCode: 200,
      body: JSON.stringify({ cool: true }),
    };
  },
  {
    auth0: {
      required: true,
    },
  }
);
