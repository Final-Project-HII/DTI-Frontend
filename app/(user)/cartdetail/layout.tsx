import { Metadata } from "next";

export interface ProductLayoutProps {
    children: React.ReactNode;
}
export const metadata: Metadata = {
    title: "Hiimart Store - Your Cart for Fast & Easy Shopping",
    description: "View and manage your cart at Hiimart Store to enjoy fast shopping, track your orders, and discover exclusive deals tailored for you.",
    keywords: ['cart', 'shopping', 'Hiimart Store', 'online shopping'],
    openGraph: {
        title: "Your Cart - Hiimart Store",
        description: "Manage your cart at Hiimart Store to enjoy fast shopping, track your orders, and discover exclusive deals tailored for you.",
        url: '/cart',
        siteName: 'Hiimart Store',
        images: [
            {
                url: '/hiimart v0.png',
                width: 800,
                height: 600,
                alt: 'Your Cart at Hiimart Store',
            },
        ],
        type: 'website',
    },
};



export default function Layout({ children }: ProductLayoutProps) {

    return (
        <div >
            <div >
                <main >{children}</main>
            </div>
        </div>
    );
}
