// import LeftNavbar from './_components/Navbar';

import AdminLeftNavbar from "../admin/_components/AdminLeftNavbar";

export interface ProductLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: ProductLayoutProps) {
  return (
    <div className="flex">
      {/* <AdminLeftNavbar /> */}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
