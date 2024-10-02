'use client'
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Button } from '../../../ui/button';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../../../ui/sheet';
import SearchInput from '../SearchInput';

const SearchSheet = () => {
  const [open, setOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    checkIfDesktop()

    window.addEventListener('resize', checkIfDesktop)

    return () => window.removeEventListener('resize', checkIfDesktop)
  }, [])

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
      <SheetContent className=" bg-transparent w-full p-0 flex flex-col h-auto max-h-20  [&>button]:hidden lg:hidden" >
        <div className="px-2 bg-gray-300">
          <div className="flex  justify-center w-full py-5 gap-4">
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="text-black hover:bg-blue-50">
                <ArrowLeft className="h-7 w-7" />
              </Button>
            </SheetClose>
            <div className="flex-grow mx-1 lg:mx-4 max-w-xl">
              <SearchInput />
            </div>
          </div>
        </div>
        {/* <nav className="flex flex-col space-y-4 px-8 ">
          <h1 className='font-bold text-xl'>Kata Kunci</h1>
        </nav> */}

      </SheetContent>
    </Sheet>
  )
}

export default SearchSheet