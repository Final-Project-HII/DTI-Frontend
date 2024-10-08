// 'use client';
// import React, { useState } from 'react';
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Home, Menu, Search, Settings, User } from "lucide-react";

// const navItems = [
//     { icon: Home, label: "Home" },
//     { icon: Search, label: "Search" },
//     { icon: User, label: "Profile" },
//     { icon: Settings, label: "Settings" },
// ];

// export default function LeftNavbar() {
//     const [open, setOpen] = useState(false);

//     return (
//         <>
//             {/* Mobile and tablet navigation */}
//             <Sheet open={open} onOpenChange={setOpen}>
//                 <SheetTrigger asChild>
//                     <Button variant="outline" size="icon" className="md:hidden fixed left-4 top-20">
//                         <Menu className="h-6 w-6" />
//                     </Button>
//                 </SheetTrigger>
//                 <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-white">
//                     <nav className="flex flex-col space-y-4 mt-20">
//                         {navItems.map((item, index) => (
//                             <Button key={index} variant="ghost" className="justify-start">
//                                 <item.icon className="mr-2 h-5 w-5" />
//                                 {item.label}
//                             </Button>
//                         ))}
//                     </nav>
//                 </SheetContent>
//             </Sheet>

//             {/* Desktop navigation */}
//             <div className="mr-4 lg:ml-16 mt-20 bg-white hidden md:flex flex-col fixed left-0  top-0 bottom-0 w-[300px] bg-background transition-all duration-300 ease-in-out">
//                 <ScrollArea className="flex-grow">
//                     <nav className="flex flex-col space-y-2 p-4 mr-4 border rounded-lg h-screen">
//                         {navItems.map((item, index) => (
//                             <Button key={index} variant="ghost" className="justify-start h-12">
//                                 <item.icon className="h-5 w-5" />
//                                 <span className="ml-2 hidden group-hover:inline-block whitespace-nowrap overflow-hidden">
//                                     {item.label}
//                                 </span>
//                             </Button>
//                         ))}
//                     </nav>
//                 </ScrollArea>
//             </div>
//         </>
//     );
// }