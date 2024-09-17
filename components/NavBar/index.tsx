"use client";
import avatar from "@/public/promo1.jpg";
import {
  ChevronDown,
  LogOutIcon,
  ShoppingCart
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { IoIosListBox } from "react-icons/io";
import "swiper/css";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import CategoryDropdown from "./_components/CategoryDropdown";
import CategorySwiper from "./_components/CategorySwiper";
import SearchInput from "./_components/SearchInput";
import SearchSheet from "./_components/SearchSheet";
import { useCart } from "@/hooks/useCart";
import { useSearchParams } from 'next/navigation';
import "swiper/css";
import SignOutButton from "../SignOutBtn";


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
  const searchParams = useSearchParams();
  const defaultSearchTerm = searchParams.get('search') || '';

  const handleSignOut = () => {
    signOut()
  }

  useEffect(() => {
    if (session) {
      setItemCount(getCartItemCount());
    } else {
      setItemCount(0);
    }
  }, [session, getCartItemCount]);


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
        <div
          className="relative z-40 text-white bg-no-repeat bg-cover py-4"
          style={{ backgroundImage: 'url("/header.svg")' }}
        >
          <div className="flex px-4 items-center justify-between lg:px-10">
            <div className="flex items-center space-x-4">
              <button
                className="flex flex-col justify-center items-center w-10 h-10 bg-yellow-400 rounded focus:outline-none lg:hidden"
                onClick={toggleMenu}
              >
                <span
                  className={`block w-6 h-1 bg-blue-500 rounded-sm transform transition-transform duration-300 ease-in-out ${open ? "rotate-45 translate-y-1" : ""
                    }`}
                ></span>
                <span
                  className={`block w-6 h-1 bg-blue-500 rounded-sm transform transition-transform duration-300 ease-in-out ${open ? "opacity-0" : "my-1"
                    }`}
                ></span>
                <span
                  className={`block w-6 h-1 bg-blue-500 rounded-sm transform transition-transform duration-300 ease-in-out ${open ? "-rotate-45 -translate-y-1" : ""
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
                <CategoryDropdown />
              </div>
            </div>
            <div className="flex-grow mx-1 lg:mx-4 max-w-xl hidden lg:block">
              <SearchInput defaultSearchTerm={searchParams.get('search') || ''} />
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

              {data?.user.role == "USER" ? (
                <div className=" items-center w-32 relative hidden lg:flex">
                  <div
                    className="flex items-center hover:bg-gray-50 hover:bg-opacity-40 gap-2 px-1 py-[2px]"
                    onClick={handleToggleDropdown}
                  >
                    <Image
                      src={avatar}
                      width={25}
                      height={25}
                      className="rounded-full object-fit h-7 w-7"
                      alt=""
                    />
                    <h3 className="font-semibold text-sm text-black line-clamp-1">
                      Hendry Tjahaja Surijanto Putra
                    </h3>
                    <ChevronDown
                      height={40}
                      width={40}
                      className="text-black"
                    />
                  </div>
                  {openDropdownMenu && (
                    <div className="absolute bottom-0 w-60  translate-y-full -left-full bg-white rounded-xl  ">
                      <div className="flex justify-between items-center px-5 py-2 border-b-2 border-gray-100 group hover:bg-blue-600">
                        <div className="flex gap-4 items-center">
                          <h3 className="font-semibold text-xs text-black line-clamp-1 group-hover:text-white">
                            Hi, Hendry Tjahaja Surijanto Putra
                          </h3>
                        </div>
                        <FaEdit
                          width={20}
                          height={20}
                          className="text-blue-600 group-hover:text-white"
                        />
                      </div>
                      <div className="flex items-center px-5 py-2 gap-4 border-b-2 border-gray-100 hover:bg-blue-600 group" onClick={handleSignOut}>
                        <LogOutIcon
                          width={16}
                          height={16}
                          className="text-red-600"
                        />
                        <h3 className='text-xs font-semibold text-black group-hover:text-white'>Logout</h3>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden lg:flex space-x-2">
                  <Link href="/register">
                    {" "}
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
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className={`absolute w-full px-4 py-2 items-center justify-center bg-white shadow-md transition-all duration-300 ease-in-out
                         ${isDesktop ? "-translate-y-full" : "-translate-y-0"}
                         ${isDesktop ? "z-10" : "z-30"}`}
        >
          <CategorySwiper />
        </div>
        <div
          className={`absolute z-30  text-xl text-blue-600 font-bold w-screen bottom-0 bg-white  transition-transform duration-500 ease-in-out ${openHamburgerMenu
            ? "translate-y-full h-screen"
            : "translate-y-0 overflow-hidden"
            }`}
        >
          {data?.user.role == "USER" ? (
            <>
              <div className="flex justify-between items-center px-5 py-2 border-b-2 border-gray-100 hover:bg-blue-600 group">
                <div className="flex gap-4 items-center">
                  <Image
                    src={avatar}
                    width={25}
                    height={25}
                    className="rounded-full object-fit h-7 w-7"
                    alt=""
                  />
                  <h3 className="font-semibold text-sm text-black group-hover:text-white">
                    Hai, Hendry Tjahaja Surijanto Putra
                  </h3>
                </div>
                <FaEdit
                  width={20}
                  height={20}
                  className="text-black group-hover:text-white"
                />
              </div>
              <div className="flex items-center px-5 py-2 gap-4 border-b-2 border-gray-100 hover:bg-blue-600 group" onClick={handleSignOut}>
                <LogOutIcon width={25} height={25} className='text-red-600' />
                <h3 className='text-sm text-black group-hover:text-white'>Logout</h3>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpenHamburgerMenu(false)}>
                <h1 className="text-blue-600 border-b-2 border-gray-100 px-5 py-4 hover:text-white hover:bg-blue-600">
                  Login
                </h1>
              </Link>
              <Link
                href="/register"
                onClick={() => setOpenHamburgerMenu(false)}
              >
                <h1 className="text-blue-600 border-b-2 border-gray-100 px-5 py-4  hover:text-white hover:bg-blue-600">
                  Register
                </h1>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
