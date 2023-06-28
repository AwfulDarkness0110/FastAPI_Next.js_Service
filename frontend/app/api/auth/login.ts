// @ts-ignore
import cookie from "cookie";
export default (req:any, res:any) => {
  const { expiresIn, accessToken, refreshToken } = req.body;

  const cookieObj = {
    expiresIn,
    accessToken,
    refreshToken,
  }

  res.setHeader(
    "Set-Cookie",
    cookie.serialize(
      "JWK",
      JSON.stringify(cookieObj),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: expiresIn,
        sameSite: "strict",
        path: "/",
      }
    )
  );
  res.status(200).json({ success: true });
};

export const setTokenCookie = (expiresIn:any, accessToken:any, refreshToken:any ) => {
   return fetch("/api/auth/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expiresIn, accessToken, refreshToken }),
    });
  };
