import { API_URL } from "@/lib/config";
import axios from "axios";
// import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";
import cookie from "cookie";

type loginData = {
  email_or_username: string;
  password: string;
};

type ResponseRequest = {
  data: JSON;
};

export const POST = async (req: NextRequest) => {
  const { email_or_username, password }: loginData = await req.json();

  // console.log("23123", email_or_username, password);
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      {
        email_or_username: email_or_username,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "*",
        },
      }
    );
    const data = response.data;

    const cookieString = await cookie.serialize(
      "token",
      String(data.data.access_token),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 60 * 10, // 10 min
        sameSite: "strict",
        path: "/",
      }
    );
    // Set headers
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
    };
    // return NextResponse.json({ error: "internal server error" });
    // Return new response
    return NextResponse.json(
      { data: data },
      {
        headers: {
          ...headers,
          "Set-Cookies": cookieString,
        },
        status: 200,
      }
    );
  } catch (err: any) {
    // console.log(err.response);
    return NextResponse.json(
      { error: err.response.data },
      { status: err.response.status }
    );
  }
  // axios
  //   .post(
  //     `${API_URL}/login`,
  //     {
  //       email_or_username: email_or_username,
  //       password: password,
  //     },
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Access-Control-Allow-Methods": "*",
  //         "Access-Control-Allow-Headers": "*",
  //       },
  //     }
  //   )
  //   .then((response) => {
  //     const data = response.data;

  //     // Set Cookie
  //     const cookieString = cookie.serialize(
  //       "token",
  //       String(data.access_token),
  //       {
  //         httpOnly: true,
  //         secure: process.env.NODE_ENV !== "development",
  //         maxAge: 60 * 10, // 10 min
  //         sameSite: "strict",
  //         path: "/",
  //       }
  //     );
  //     console.log("cookieString: ", data);

  //     // Set headers
  //     const headers = {
  //       "Content-Type": "application/json",
  //       "Access-Control-Allow-Methods": "*",
  //       "Access-Control-Allow-Headers": "*",
  //       "Set-Cookie": cookieString,
  //     };
  //     return NextResponse.json({ error: "internal server error" });
  //     // Return new response
  //     return NextResponse.json(
  //       { data: data }
  //       // {
  //       //   headers,
  //       //   status: 200,
  //       // }
  //     );

  //     // @to-do - Set Cookie
  //     // res.setHeader(
  //     //   "Set-Cookie",
  //     // cookie.serialize("token", String(data.access_token), {
  //     //   httpOnly: true,
  //     //   secure: process.env.NODE_ENV !== "development",
  //     //   maxAge: 60 * 60 * 24 * 7, // 1 week
  //     //   sameSite: "strict",
  //     //   path: "/",
  //     // })
  //     // );

  //     // return new NextResponse(
  //     //   JSON.stringify({ name: "Please provide something to search for" }),
  //     //   { status: 400 }
  //     // );
  //   })
  //   .catch((err) => {
  //     console.log("response err: ", err);
  //     return NextResponse.json({ error: "internal server error" });
  //   });
};
