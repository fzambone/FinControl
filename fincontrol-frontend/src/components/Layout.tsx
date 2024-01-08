import React from 'react';
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer"

type LayoutProps = {
    children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => (
    <>
        <Header />
        <main>{children}</main>
        <Footer />
    </>
);

export default Layout;