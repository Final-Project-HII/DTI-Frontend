// import React from 'react';
// import Link from 'next/link';
// import { LayoutGrid, Search, ShoppingCart } from 'lucide-react';
// import { Badge } from './ui/badge';

// const Header = () => {
//     const itemCount = 5;

//     return (
//         <header
//             className="text-white h-20 pt-5 bg-no-repeat bg-cover"
//             style={{
//                 backgroundImage: 'url("/header.svg")',
//                 // transform: 'rotate(90deg)', // Rotate the background image 90 degrees
//                 transformOrigin: 'center', // Ensure the rotation happens around the center
//             }}
//         >
//             <div className="container mx-auto flex justify-between items-center h-full">
//                 <div className="text-3xl font-bold text-blue-600  italic flex gap-4">
//                     <Link href="/">Click</Link>
//                 </div>
//                 <img src="/hiimart v6.png" alt="" className='w-28 mx-4' />
//                 <div className="flex gap-1">
//                     <LayoutGrid />
//                     <Link href="/" className='not-italic text-lg'>Category</Link>
//                 </div>
//                 <div className='bg-white rounded-md flex h-10 w-full justify-between mx-4'>
//                     <p className='p-2 text-gray-500 '>Mau beli apa hari ini</p>
//                     <button className='bg-yellow-300 text-white p-auto rounded-lg m-1 px-4 mx-4'><Search className='text-blue-600' /></button>
//                 </div>
//                 <nav>
//                     <ul className="flex space-x-4">
//                         {/* <li>
//                             <Link href="/">Home</Link>
//                         </li> */}
//                         <li>
//                             <div className="relative">
//                                 <ShoppingCart className="w-8 h-8 text-blue-600" /> {/* Ikon Lucide */}
//                                 <Badge
//                                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full"
//                                     variant="default"
//                                 >
//                                     {itemCount}
//                                 </Badge>
//                             </div>
//                         </li>
//                         <li>
//                             <Link href="/about" className='text-blue-600 bg-white border-2 border-blue-600 rounded-lg p-2 px-4 font-bold italic'>Login</Link>
//                         </li>
//                         <li>
//                             <Link href="/about" className='text-white bg-blue-600  rounded-lg p-2 px-4 font-bold italic'>Login</Link>
//                         </li>
//                     </ul>
//                 </nav>
//             </div>
//         </header>
//     );
// };

// export default Header;
import React from 'react';
import Link from 'next/link';
import { LayoutGrid, Search, ShoppingCart, Menu, ChevronDown } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "./ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"

const Header = () => {
    const itemCount = 5;
    const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Toys'];

    return (
        <header className="fixed top-0 w-full z-50 text-white bg-no-repeat bg-cover" style={{ backgroundImage: 'url("/header.svg")' }}>
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="hidden lg:block lg:text-2xl font-bold text-blue-600 italic">
                            <Link href="/">Click</Link>
                        </div>
                        <img src="/hiimart v6.png" alt="HiiMart Logo" className="w-24 h-auto hidden lg:block" />
                        {/* <img src="/hiimart v0.png" alt="HiiMart Logo" className="w-8 h-auto lg:hidden" /> */}
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
                                            <Link href={`/category/${category.toLowerCase()}`}>{category}</Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div className="flex-grow mx-1 lg:mx-4 max-w-xl">
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-3 pr-16 py-2 rounded-md text-black"
                            />
                            <Button
                                size="sm"
                                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-yellow-300 hover:bg-yellow-400 rounded-lg p-1 px-3 mx-2"
                            >
                                <Search className="h-5 w-5 text-blue-600" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center lg:space-x-4 space-x-1">
                        <div className="hidden lg:flex space-x-2">
                            <Button variant="outline" className="bg-white text-blue-600 hover:bg-blue-50">Sign Up</Button>
                            <Button className="bg-blue-600 text-white hover:bg-blue-700">Login</Button>
                        </div>
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingCart className="h-6 w-6 text-blue-600" />
                            <Badge className="absolute -top-2 -right-2 bg-red-500">{itemCount}</Badge>
                        </Button>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden">
                                    <Menu className="h-6 w-6 text-blue-600" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="bg-white">
                                <nav className="flex flex-col space-y-4">
                                    <Link href="/" className="text-lg font-semibold text-blue-600">Home</Link>
                                    <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">Sign Up</Button>
                                    <Button className="w-full bg-white text-blue-600 border border-blue-600 hover:bg-blue-50">Login</Button>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;