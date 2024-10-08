import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
<<<<<<< HEAD:app/(user)/payment-process/layout.tsx
import AdminLeftNavbar from "../../admin/_components/AdminLeftNavbar";
=======
>>>>>>> d5ff1bf87964c1f493c558096aac04392c8f17a7:app/payment-process/layout.tsx

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
