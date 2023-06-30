import { getNewAccessToken } from "@/app/utils/http-only/cookie";
import cookie from "cookie";
import jwt_decode from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";

export default async (req: NextRequest) => {
  const cookies = cookie.parse(req.cookies);
  const appCookie = cookies?.["token"] ?? "";
  const parsedCookies = appCookie ? JSON.parse(appCookie) : {};
  const accessToken = parsedCookies?.accessToken ?? null;

  if (!accessToken) {
    return NextResponse.json(
      { success: true, token: null },
      {
        status: 200,
      }
    );
  }

  const { exp }: any = jwt_decode(accessToken);
  const isAccessTokenExpired = Date.now() / 1000 > exp;

  const refreshToken = parsedCookies?.refreshToken;

  /**
   * Fetch new access token if it expires
   */
  if (isAccessTokenExpired) {
    try {
      /**
       * It can be REST API or GraphQL
       */
      const data: any = await getNewAccessToken(refreshToken);

      const cookieObj = {
        expiresIn: data.ExpiresIn,
        accessToken: data.AccessToken,
        refreshToken,
      };
      const cookieString = await cookie.serialize(
        "token",
        JSON.stringify(cookieObj),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 60 * 10, // 10 min
          sameSite: "strict",
          path: "/",
        }
      );
      return NextResponse.json(
        { data: data },
        {
          headers: {
            "Set-Cookies": cookieString,
          },
          status: 200,
        }
      );
    } catch (err: any) {
      // if refresh token fails to get new access token
      return NextResponse.json(
        { error: err.response.data },
        { status: err.response.status }
      );
    }
  }
};
