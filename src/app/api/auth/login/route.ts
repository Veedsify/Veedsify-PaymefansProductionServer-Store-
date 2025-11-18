import AuthService from "@/server/AuthService";
import { signIn } from "@auth";
import { AuthError } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function loginAction(email: string, password: string) {
  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (result?.error) {
    return { success: false, error: result.error };
  }

  return { success: true };
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          error: true,
          message: "Email or Passowrd is Missing",
        },
        {
          status: 400,
          statusText: "Bad Request",
        }
      );
    }

    const res = await loginAction(email, password);

    if (res?.success) {
      return NextResponse.json(res, { status: 200 });
    } else {
      return NextResponse.json(res, { status: 400 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: true,
        message: "Failed to retrieve user",
      },
      { status: 500 }
    );
  }
}
