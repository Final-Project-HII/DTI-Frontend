import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";

export interface ProductLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: ProductLayoutProps) {
  return (
    <div>
      <NavBar />
      <div>
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
}
