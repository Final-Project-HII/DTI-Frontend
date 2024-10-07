'use client'
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { logout } from "@/hooks/useLogout";
import { cn } from "@/lib/utils";
import logo from '@/public/LogoV3.png';
import {
    Box,
    ChevronDown,
    FileText,
    FolderTree,
    LayoutDashboard,
    LogOut,
    Package,
    ShoppingCart,
    Users,
    Warehouse
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IoMdMenu } from 'react-icons/io';

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { name: 'Products', icon: Package, href: '/admin/product' },
    { name: 'Category', icon: FolderTree, href: '/admin/category' },
    {
        name: 'Stock',
        icon: Box,
        subitems: [
            { name: 'Stock Management', href: '/admin/stock/management' },
            { name: 'Stock Request', href: '/admin/stock/request' },
            { name: 'Stock Approval', href: '/admin/stock/approval' },
        ],
    },
    {
        name: 'Report',
        icon: FileText,
        subitems: [
            { name: 'Stock Report', href: '/admin/report/stock' },
            { name: 'Sales Report', href: '/admin/report/sales' },
        ],
    },
    {
        name: 'Transaction',
        icon: ShoppingCart,
        subitems: [
            { name: 'Order', href: '/admin/transaction/order' },
            { name: 'Confirm Payment', href: '/admin/transaction/confirm-payment' },
        ],
    },
    { name: 'Admin', icon: Users, href: '/admin/admin-management', role: 'SUPER' },
    { name: 'Warehouse', icon: Warehouse, href: '/admin/warehouse', role: 'SUPER' },
];

const AdminLeftNavbar: React.FC = () => {

    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(document.documentElement.clientWidth < 768);
        };

        checkMobile();

        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        setIsExpanded(!isMobile);
    }, [isMobile]);

    const toggleSidebar = () => {
        if (!isMobile) {
            setIsExpanded(!isExpanded);
        }
    };

    const filteredMenuItems = menuItems.filter(item => {
        if (item.role) {
            return session?.user?.role === item.role;
        }
        return true;
    });

    const handleSignOut = async () => {
        try {
            await logout(session!.user.accessToken)
            signOut()
        } catch (error) {
            console.log("Error to logout")
        }
    }



    return (
        <div className={`${isExpanded ? "min-w-64" : "min-w-20"
            } min-h-screen flex flex-col bg-white relative text-blue-900 transition-all duration-300 overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full opacity-10 transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-600 rounded-full opacity-10 transform -translate-x-20 translate-y-20"></div>

            <div className={`${isExpanded ? "justify-between" : "justify-center"} flex  p-4 relative z-10 gap-2 items-center`}>
                <Image src={logo} alt="logo" className={`${isExpanded ? "flex w-28" : "hidden"} w-12  mb-5 `} />
                {!isMobile && <IoMdMenu size={30} onClick={toggleSidebar} />}
            </div>
            <div className={`${isExpanded ? "block" : "hidden"} text-sm font-bold text-blue-900 mb-2 px-4 relative z-10`}>MAIN</div>
            <nav className="flex-1 px-2 py-2 relative z-10">
                {filteredMenuItems.map((item, index) => (
                    <React.Fragment key={index}>
                        {item.subitems ? (
                            <>
                                <div className={`${isExpanded ? "block" : "hidden"}`}>
                                    <Collapsible>
                                        <CollapsibleTrigger className="flex flex-col lg:flex-row items-center justify-between w-full p-2 hover:bg-blue-600 hover:text-white rounded-md transition-colors duration-150">
                                            <div className="flex flex-col lg:flex-row items-center">
                                                <item.icon className="w-6 h-6 mb-1 lg:mb-0 lg:mr-2" />
                                                <span className="text-xs lg:text-base">{item.name}</span>
                                            </div>
                                            <ChevronDown className="h-4 w-4 hidden lg:inline" />
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            {item.subitems.map((subitem, subIndex) => (
                                                <Link
                                                    href={subitem.href}
                                                    key={subIndex}
                                                    className={cn(
                                                        "block py-2 my-1 text-xs lg:text-sm hover:bg-blue-600 hover:text-white rounded-md transition-colors duration-150 text-center lg:text-left",
                                                        "lg:pl-8",
                                                        pathname === subitem.href && "bg-blue-600 text-white font-semibold"
                                                    )}
                                                >
                                                    {subitem.name}
                                                </Link>
                                            ))}
                                        </CollapsibleContent>
                                    </Collapsible>
                                </div>

                                <div className={`${isExpanded ? "hidden" : "block"}`}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="flex flex-col items-center p-2 my-1 w-full hover:bg-blue-600 hover:text-white rounded-md transition-colors duration-150">
                                            <item.icon className="w-6 h-6 mb-1" />
                                            <span className="text-xs">{item.name}</span>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-48" side="right">
                                            {item.subitems.map((subitem, subIndex) => (
                                                <DropdownMenuItem key={subIndex} asChild>
                                                    <Link
                                                        href={subitem.href}
                                                        className={cn(
                                                            "block py-2 my-1 text-xs hover:bg-blue-600 hover:text-white rounded-md transition-colors duration-150",
                                                            pathname === subitem.href && "bg-blue-600 text-white font-semibold"
                                                        )}
                                                    >
                                                        {subitem.name}
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </>
                        ) : (
                            <Link
                                href={item.href}
                                className={cn(
                                    `flex items-center p-2 my-1 hover:bg-blue-600 hover:text-white rounded-md transition-colors duration-150`,
                                    isExpanded ? 'flex-row' : 'flex-col',
                                    pathname === item.href && 'bg-blue-600 text-white font-semibold'
                                )}
                            >
                                <item.icon className={`${isExpanded ? "mr-2 mb-0" : ""} w-6 h-6`} />
                                <span className={`${isExpanded ? "text-base" : "text-xs"}`}>{item.name}</span>
                            </Link>
                        )}
                    </React.Fragment>
                ))}
            </nav>
            <div className="px-4 pb-4 z-10">
                <Button variant="default" className={`${isExpanded ? "flex-row" : "flex-col"} mt-4 bg-blue-600 hover:bg-blue-700 text-white w-full gap-2 flex flex-col lg:flex-row items-center justify-center transition-colors duration-150`} onClick={handleSignOut}>
                    <LogOut className="h-5 w-5 lg:w-4 lg:h-4" />
                    <span className={`${isExpanded ? "flex text-base" : "hidden text-xs"}`}>Logout</span>
                </Button>
            </div>
        </div >
    );
};

export default AdminLeftNavbar;