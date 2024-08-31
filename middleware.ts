import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/", "/login", "/register", "/reset-password", "/cartdetail"],
};
export default auth((req: any) => {
  const reqUrl = new URL(req.url);
  const path = reqUrl.pathname;

  console.log(req.auth?.user.role);
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
