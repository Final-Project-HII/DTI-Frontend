'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { ArrowLeft, Search } from 'lucide-react';
import { useMediaQuery } from '@uidotdev/usehooks';

const SearchSheet = () => {
  const [open, setOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    if (isDesktop && open) {
      setOpen(false);
    }
  }, [isDesktop, open]);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild  >
        <Button variant="ghost" size="icon" className="lg:hidden">
          <FaSearch className="h-6 w-6 text-blue-600" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-white w-full h-full p-0 flex flex-col  [&>button]:hidden lg:hidden" >
        <div className="px-2 bg-gray-300">
          <div className="flex  justify-center w-full py-5 gap-4">
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="text-black hover:bg-blue-50">
                <ArrowLeft className="h-7 w-7" />
              </Button>
            </SheetClose>
            <div className="flex-grow mx-1 lg:mx-4 max-w-xl">
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
                  {isFocused ? <FaTimes className="h-5 w-5 text-blue-600" /> : <Search className="h-5 w-5 text-blue-600" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <nav className="flex flex-col space-y-4 px-8 ">
          <h1 className='font-bold text-xl'>Kata Kunci</h1>
        </nav>

      </SheetContent>
    </Sheet>
  )
}

export default SearchSheet