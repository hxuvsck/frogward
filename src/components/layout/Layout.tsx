import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import PageTransition from './PageTransition';

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 pt-16">
      <PageTransition>{children}</PageTransition>
    </main>
    <Footer />
  </div>
);

export default Layout;
