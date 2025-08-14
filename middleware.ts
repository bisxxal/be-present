import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default withAuth( async function middleware(req: NextRequest) {
    // Allow access for authenticated users
    const { nextUrl } = req;
    const token = await getToken({ req })
    if (token && nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },


    pages: {
      signIn: "/sign-in",
    },
  }
)

export const config = {
  matcher: [
    "/attendance/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/timetable/:path*",
    "/track/:path*",
    "/streak/:path*",
    "/pdf/:path*",
  ],
}
 