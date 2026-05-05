import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({ request: req })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          response = NextResponse.next({ request: req })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = req.nextUrl.pathname

  // Redirect unauthenticated users away from dashboard
  if (!user && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
  if (!user && pathname.startsWith("/settings")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Redirect authenticated users away from login
  if (user && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return response
}

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/login"],
}
