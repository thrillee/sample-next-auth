import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const pathName = req.nextUrl.pathname;
    const role = req.nextauth.token.role;
    console.log(req.nextUrl.pathname);
    console.log(role);

    // if (pathName.startsWith("/CreateUser") && role != "admin"){
    // return NextResponse.rewrite(new URL("/Denied", req.url))
    // }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = { matcher: ["/CreateUser"] };
