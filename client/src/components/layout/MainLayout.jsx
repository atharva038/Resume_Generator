import {useState, useEffect} from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import {useToggle} from "@/hooks";

const MainLayout = ({children}) => {
  const [
    isSidebarOpen,
    toggleSidebar,
    setIsSidebarOpenTrue,
    setIsSidebarOpenFalse,
  ] = useToggle(false);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={toggleSidebar} />

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        {/* Top Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <main className="pt-16">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
