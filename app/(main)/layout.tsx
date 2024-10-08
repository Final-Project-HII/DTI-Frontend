import NavBar from '@/components/NavBar';

export const metadata = {
    title: "Hiimart Product Search - Find Your Desired Products Easily",
    description: "Browse and filter through a wide range of products at Hiimart. Enjoy fast and easy shopping with detailed product information and filtering options.",
    keywords: "Hiimart, online shopping, product search, ecommerce, product filtering, fast delivery, buy online",
    openGraph: {
        title: "Hiimart Product Search - Fast & Easy Shopping",
        description: "Discover a variety of products with advanced search and filtering options at Hiimart. Shop online with confidence.",
        type: "website",
    },
    robots: {
        index: true,
        follow: true,
    },
};
export interface ProductLayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: ProductLayoutProps) {

    return (
        <div >
            <NavBar />
            <div >
                <main >{children}</main>
            </div>
        </div>
    );
}
