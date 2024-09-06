import Footer from '@/components/Footer';
import LeftNavbar from './product/_components/LeftNavbar';
import Header from '@/components/Header';
import ReasonToShop from "@/app/_components/ReasonToShop";
import DownloadApp from "@/app/_components/DownloadApp";
import NavBar from '@/components/NavBar';

export interface ProductLayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: ProductLayoutProps) {
    return (
        <div >
            <NavBar />
            <div >
                {/* <LeftNavbar /> */}
                <main >{children}</main>
            </div>
            {/* <ReasonToShop />
            <DownloadApp /> */}
            <Footer />
        </div>
    );
}
