import {useState, useEffect} from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const MainLayout = ({children}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Auto-open sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        {/* Top Navbar */}
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Page Content */}
        <main className="pt-16">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
