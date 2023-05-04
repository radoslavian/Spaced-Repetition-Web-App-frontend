import { rest } from "msw";

// usage tutorial:
// https://mswjs.io/docs/getting-started/mocks/rest-api

const authToken = {
    auth_token: "7f3371589a52d0ef17877c61d1c82cdf9b7d8f3f"
};

export const handlers = [
    rest.post("/auth/token/login/", (req, res, ctx) => {
	return res(
	    ctx.status(200),
	    ctx.json(authToken)
	);
    })
];
