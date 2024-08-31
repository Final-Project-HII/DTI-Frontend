"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/app/hooks/useCart";
import { useSession, signOut } from "next-auth/react";

const Navbar: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { getCartItemCount } = useCart(session?.user?.email ?? undefined);
  const itemCount = getCartItemCount();

  const handleCartClick = () => {
    router.push("/cartdetail");
  };

  const handleAuthClick = () => {
    signOut();
  };

  return (
    <nav className="bg-yellow-400 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          KLIK
        </Link>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Mau beli apa hari ini?"
            className="p-2 rounded-l-md w-64"
          />
          <Button variant="secondary" className="rounded-l-none">
            Search
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            className="flex items-center"
            onClick={handleCartClick}
          >
            <ShoppingCart className="mr-2" />
            Cart
            {itemCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {itemCount}
              </Badge>
            )}
          </Button>
          <Button
            variant="outline"
            className="flex items-center"
            onClick={handleAuthClick}
          >
            {status === "authenticated" ? (
              <>
                <LogOut className="mr-2" />
                Logout
              </>
            ) : (
              <>
                <LogIn className="mr-2" />
                Login
              </>
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
