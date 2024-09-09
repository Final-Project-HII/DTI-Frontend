"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";

import { useRouter } from "next/navigation";

const SignOutButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);
    signOut();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="btn border-none bg-red-600 hover:bg-white text-white hover:text-black w-24 md:w-36 rounded-full"
    >
      <p className="p-3 tex-2xl font-bold">
        {isLoading ? "Logging out..." : "Sign out"}
      </p>
    </button>
  );
};

export default SignOutButton;
