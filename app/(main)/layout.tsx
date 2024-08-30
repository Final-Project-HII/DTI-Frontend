import LeftNavbar from './product/_components/LeftNavbar';
import Header from '@/components/Header';

export interface ProductLayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: ProductLayoutProps) {
    return (
        <div >
            <Header />
            <div >
                {/* <LeftNavbar /> */}
                <main >{children}</main>
            </div>
        </div>
    );
}
