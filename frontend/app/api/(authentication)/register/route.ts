import { API_URL } from "@/lib/config";
import axios from "axios";
import cookie from "cookie";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { username, first_name, last_name, email, password } = await req.json();

  console.log(username, first_name, last_name, email, password);
  try {
    const response = await axios.post(
      `${API_URL}/register`,
      {
        username: username,
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    // Set Cookie
    const cookieString = await cookie.serialize(
      "token",
      String(data.token.access_token),
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
          "Set-Cookie": cookieString,
        },
        status: 200,
      }
    );
  } catch (err: any) {
    // console.log(err.response.data)
    return NextResponse.json(
      { error: err.response.data },
      { status: err.response.status }
    );
  }
};
