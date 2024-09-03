"use client";
import avatar from "@/public/promo1.jpg";
import { useMediaQuery } from "@uidotdev/usehooks";
import Image from "next/image";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import { IoIosListBox } from "react-icons/io";
import "swiper/css";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import CategoryDropdown from "./_components/CategoryDropdown";
import CategorySwiper from "./_components/CategorySwiper";
import SearchInput from "./_components/SearchInput";
import SearchSheet from "./_components/SearchSheet";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
  LayoutGrid,
  Search,
  ShoppingCart,
  Menu,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";

import { FaSearch, FaTimes } from "react-icons/fa";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import SignOutButton from "../SignOutBtn";
import { useCart } from "@/app/hooks/useCart";

const NavBar = () => {
  const { data: session } = useSession();
  const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home & Garden",
    "Electronics",
    "Clothing",
    "Books",
    "Home & Garden",
  ];
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [openHamburgerMenu, setOpenHamburgerMenu] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [openDropdownMenu, setOpenDropdownMenu] = useState(false);
  const { getCartItemCount } = useCart();
  const [itemCount, setItemCount] = useState(0);
  const { data } = useSession();

  useEffect(() => {
    if (session) {
      setItemCount(getCartItemCount());
    } else {
      setItemCount(0);
    }
  }, [session, getCartItemCount]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const toggleMenu = () => {
    setOpenHamburgerMenu((prev) => !prev);
  };

  const handleToggleDropdown = () => {
    setOpenDropdownMenu((prev) => !prev);
  };

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);

    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  useEffect(() => {
    if (isDesktop && openHamburgerMenu) {
      setOpenHamburgerMenu(false);
    }
    if (!isDesktop && openDropdownMenu) {
      setOpenDropdownMenu(false);
    }
  }, [isDesktop, openHamburgerMenu]);

  return (
    <header className="fixed top-0 w-full z-50 text-white bg-no-repeat bg-cover">
      <div className="relative">
        {/* Main navbar content */}
        <div
          className="relative z-20 text-white bg-no-repeat bg-cover py-4"
          style={{ backgroundImage: 'url("/header.svg")' }}
        >
          <div className="flex px-4 items-center justify-between lg:px-10">
            <div className="flex items-center space-x-4">
              <button
                className="flex flex-col justify-center items-center w-10 h-10 bg-yellow-400 rounded focus:outline-none lg:hidden"
                onClick={toggleMenu}
              >
                <span
                  className={`block w-6 h-1 bg-blue-500 rounded-sm transform transition-transform duration-300 ease-in-out ${
                    open ? "rotate-45 translate-y-1" : ""
                  }`}
                ></span>
                <span
                  className={`block w-6 h-1 bg-blue-500 rounded-sm transform transition-transform duration-300 ease-in-out ${
                    open ? "opacity-0" : "my-1"
                  }`}
                ></span>
                <span
                  className={`block w-6 h-1 bg-blue-500 rounded-sm transform transition-transform duration-300 ease-in-out ${
                    open ? "-rotate-45 -translate-y-1" : ""
                  }`}
                ></span>
              </button>
              <div className="hidden lg:block lg:text-2xl font-bold text-blue-600 italic">
                <Link href="/">Click</Link>
              </div>
              <img
                src="/hiimart v6.png"
                alt="HiiMart Logo"
                className="w-24 h-auto hidden lg:block"
              />
              <div className="hidden lg:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-blue-600">
                      <LayoutGrid className="mr-2 h-5 w-5" />
                      Category
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white">
                    {categories.map((category, index) => (
                      <DropdownMenuItem key={index}>
                        <Link href={`/category/${category.toLowerCase()}`}>
                          {category}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex-grow mx-1 lg:mx-4 max-w-xl hidden lg:block">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-3 pr-16 py-2 rounded-md text-black"
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <Button
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-yellow-300 hover:bg-yellow-400 rounded-lg p-1 px-3 mx-2"
                >
                  {isFocused ? (
                    <FaTimes className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Search className="h-5 w-5 text-blue-600" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center lg:space-x-4 space-x-1">
              <Button variant="ghost" size="icon" className="relative">
                <IoIosListBox className="h-6 w-6 text-blue-600" />
              </Button>
              <SearchSheet />
              <Link href="/cartdetail">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                  {session && itemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500">
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              <div className="hidden lg:flex space-x-2">
                {!session ? (
                  <>
                    <Link href="/register">
                      <Button
                        variant="outline"
                        className="bg-white text-blue-600 hover:bg-blue-50"
                      >
                        Sign Up
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button className="bg-blue-600 text-white hover:bg-blue-700">
                        Login
                      </Button>
                    </Link>
                  </>
                ) : (
                  <SignOutButton />
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`absolute w-full px-4 py-2 items-center justify-center bg-white shadow-md transition-all duration-300 ease-in-out
                         ${isDesktop ? "-translate-y-full" : "-translate-y-0"}
                         ${isDesktop ? "z-10" : "z-30"}`}
        >
          <Swiper
            spaceBetween={10}
            slidesPerView={6}
            freeMode={true}
            grabCursor={true}
            breakpoints={{
              320: {
                slidesPerView: 4,
              },

              768: {
                slidesPerView: 6,
              },
            }}
          >
            {categories.map((category, index) => (
              <SwiperSlide key={index} className="w-auto">
                <h2 className="text-black">{category}</h2>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
