import {useEffect, useState} from "react";
import {Navigate, useLocation} from "react-router-dom";
import {superAdminStorage, verifySuperAdminSession} from "@/api/superAdmin.api";
import {ShieldCheck, Loader2} from "lucide-react";

const SuperAdminProtectedRoute = ({children}) => {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      if (!superAdminStorage.isAuthenticated()) {
        if (isMounted) {
          setIsValid(false);
          setChecking(false);
        }
        return;
      }

      try {
        const res = await verifySuperAdminSession();
        if (isMounted) {
          if (res.success && res.valid) {
            setIsValid(true);
          } else {
            superAdminStorage.clearToken();
            setIsValid(false);
          }
        }
      } catch (err) {
        if (isMounted) {
          superAdminStorage.clearToken();
          setIsValid(false);
        }
      } finally {
        if (isMounted) {
          setChecking(false);
        }
      }
    };

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-zinc-900/80 border border-emerald-500/20 backdrop-blur-xl shadow-2xl">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 animate-pulse">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <Loader2 className="w-6 h-6 text-emerald-400 animate-spin absolute -bottom-2 -right-2" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-black uppercase tracking-widest text-emerald-400">
              Super Admin Gateway
            </p>
            <p className="text-xs text-zinc-400">
              Verifying cryptographic credentials & session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/super-admin/login" state={{from: location}} replace />;
  }

  return children;
};

export default SuperAdminProtectedRoute;
