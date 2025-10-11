import {Outlet} from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white py-6 no-print">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 AI Resume Rebuilder. Powered by Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
