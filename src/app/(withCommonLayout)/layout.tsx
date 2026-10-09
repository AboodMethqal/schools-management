import Footer from "@/components/shared/footer/Footer";
import Navbar from "@/components/shared/navbar/Navbar";
import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <div className="min-h-[90vh]">
        <Navbar/>
        {children}
        <Footer/>
      </div>
    </div>
  );
};

export default Layout;
