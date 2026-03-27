import {Navigate, useLocation} from "react-router-dom";
import {useAuth} from "@/context/AuthContext";

const ProtectedRoute = ({children}) => {
  const {user, loading} = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 dark:border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{from: location}} replace />;
  }

  return children;
};

export default ProtectedRoute;
