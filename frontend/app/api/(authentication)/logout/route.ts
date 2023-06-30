import cookie from "cookie";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  // DESTROY COOKIE.
  const cookieString = await cookie.serialize("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    expires: new Date(0),
    sameSite: "strict",
    path: "/",
  });

  return NextResponse.json({
    headers: {
      "Set-Cookie": cookieString,
    },
    status: 200,
  });
};
