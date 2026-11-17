import React from 'react';
import { AnnouncementBar } from './AnnouncementBar';
import { Navbar } from './Navbar';
import { CategorySidebar } from './CategorySidebar';
import { FloatingCartTab } from './FloatingCartTab';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { AccountDrawer } from './AccountDrawer';
import { QuickViewModal } from './QuickViewModal';
import { ToastContainer } from './ToastContainer';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CategorySidebar />
      <FloatingCartTab />
      <CartDrawer />
      <AccountDrawer />
      <QuickViewModal />
      <ToastContainer />
    </div>
  );
};
