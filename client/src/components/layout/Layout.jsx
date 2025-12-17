import {Outlet, useLocation} from "react-router-dom";
import {useState, useEffect} from "react";
import {useToggle} from "@/hooks";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {PageTransition} from "@/components/common";

const Layout = () => {
  const [
    isSidebarOpen,
    toggleSidebar,
    setIsSidebarOpenTrue,
    setIsSidebarOpenFalse,
  ] = useToggle(false);
  const location = useLocation();

  // Auto-open sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpenTrue();
      } else {
        setIsSidebarOpenFalse();
      }
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsSidebarOpenTrue, setIsSidebarOpenFalse]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={toggleSidebar} />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        {/* Top Navbar */}
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Page Content with Transition */}
        <main className="flex-1 pt-16 md:pt-20 w-full">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
