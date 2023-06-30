import { API_URL } from "@/lib/config";
import axios from "axios";
import cookie from "cookie";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  if (!req.cookies) {
    //   res.status(403).json({message: 'Not Authorized'})
    //   return
    return NextResponse.json(
      { error: "Not Authorized" },
      {
        status: 200,
      }
    );
  }

  const { token } = cookie.parse(req.cookies);

  const apiRes = await axios
    .get(`${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(async (res) => {
      const user = await res.data;
      return NextResponse.json(
        { data: user },
        {
          status: 200,
        }
      );
    })
    .catch((err) => {
      console.log(err);
      return NextResponse.json(
        { error: "User Forbidden" },
        {
          status: 403,
        }
      );
    });
};
