import AdminLeftNavbar from './_components/AdminLeftNavbar';
export interface ProductLayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: ProductLayoutProps) {
    return (
        <div className="flex w-full ">
            <AdminLeftNavbar />
            <main className="flex-1 p-4 w-full overflow-x-auto">
                {children}
            </main>
        </div>
    );
}
