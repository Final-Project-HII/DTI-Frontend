'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import {
    ChevronDown,
    LayoutDashboard,
    Package,
    FolderTree,
    Box,
    FileText,
    ShoppingCart,
    Users,
    Warehouse,
    LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { name: 'Products', icon: Package, href: '/admin/product' },
    { name: 'Category', icon: FolderTree, href: '/admin/category' },
    {
        name: 'Stock',
        icon: Box,
        subitems: [
            { name: 'Stock Management', href: '/stock/management' },
            { name: 'Stock Request', href: '/stock/request' },
            { name: 'Stock Approval', href: '/stock/approval' },
        ],
    },
    {
        name: 'Report',
        icon: FileText,
        subitems: [
            { name: 'Stock Report', href: '/report/stock' },
            { name: 'Sales Report', href: '/report/sales' },
        ],
    },
    {
        name: 'Transaction',
        icon: ShoppingCart,
        subitems: [
            { name: 'Order', href: '/transaction/order' },
            { name: 'Confirm Payment', href: '/transaction/confirm-payment' },
        ],
    },
    { name: 'Admin', icon: Users, href: '/admin' },
    { name: 'Warehouse', icon: Warehouse, href: '/warehouse' },
];

const AdminLeftNavbar: React.FC = () => {
    const pathname = usePathname();

    return (
        <div className=" w-64 min-h-screen flex flex-col bg-gradient-to-b from-yellow-300 to-yellow-400 text-blue-900 relative overflow-hidden">
            {/* Decorative shapes */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full opacity-10 transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-600 rounded-full opacity-10 transform -translate-x-20 translate-y-20"></div>

            <div className='flex justify-center p-4 relative z-10'>
                <img src="/hiimart v6.png" alt="logo" className='w-28 mb-5 flex' />
            </div>
            <div className="text-sm font-bold text-blue-900 mb-2 px-4 relative z-10">MAIN</div>
            <nav className="flex-1 px-2 py-2 relative z-10">
                {menuItems.map((item, index) => (
                    <React.Fragment key={index}>
                        {item.subitems ? (
                            <Collapsible>
                                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-yellow-200 hover:text-blue-700 rounded-md transition-colors duration-150">
                                    <div className="flex items-center">
                                        <item.icon className="mr-2 h-4 w-4" />
                                        {item.name}
                                    </div>
                                    <ChevronDown className="h-4 w-4" />
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    {item.subitems.map((subitem, subIndex) => (
                                        <Link
                                            href={subitem.href}
                                            key={subIndex}
                                            className={cn(
                                                "block pl-8 py-2 my-1 text-sm hover:bg-yellow-200 hover:text-blue-700 rounded-md transition-colors duration-150",
                                                pathname === subitem.href && "bg-blue-500 text-yellow-100 font-semibold"
                                            )}
                                        >
                                            {subitem.name}
                                        </Link>
                                    ))}
                                </CollapsibleContent>
                            </Collapsible>
                        ) : (
                            <Link
                                href={item.href}
                                className={cn(
                                    "flex items-center p-2 my-1 hover:bg-yellow-200 hover:text-blue-700 rounded-md transition-colors duration-150",
                                    pathname === item.href && "bg-blue-500 text-yellow-100 font-semibold"
                                )}
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.name}
                            </Link>
                        )}
                    </React.Fragment>
                ))}
            </nav>
            <div className="px-4 pb-4 z-10">
                <Button variant="default" className="mt-4 bg-blue-600 hover:bg-blue-700 text-yellow-100 w-full flex items-center justify-center transition-colors duration-150">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
            </div>
        </div>
    );
};

export default AdminLeftNavbar;