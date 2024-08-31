import { auth } from "@/auth";
import { url } from "inspector";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/", "/login", "/register", "/reset-password", "/cartdetail"],
};
export default auth((req: any) => {
  const reqUrl = new URL(req.url);
  const path = reqUrl.pathname;

  console.log(req.auth?.user);
  console.log("ini auth", req.auth);
  const publicRoutes = ["/login", "/register", "/reset-password", "/"];
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  if (!req.auth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { role } = req.auth.user;

  return NextResponse.next();
});

////////////////////////////////////////////////////////////////////////

// export async function middleware(request: NextRequest) {
//   const session = await auth;
//   console.log("session", session.name);
//   // const userRoles = session.?.userRoles
//   // console.log(request);
//   // console.log("ini auth", session)
//   if (request.nextUrl.pathname.startsWith("/cartdetail")) {
//     if (!session) {
//       console.log("no session");
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//     return NextResponse.next();
//   }
// }

// export const config = {
//   matcher: ["/", "/login", "/register", "/reset-password", "/cartdetail"],
// };
