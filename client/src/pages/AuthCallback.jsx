import {useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {Loader2} from "lucide-react";

/**
 * OAuth Callback Handler
 * Processes OAuth redirects from Google/GitHub
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {setUserData} = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const token = searchParams.get("token");
      const provider = searchParams.get("provider");
      const error = searchParams.get("error");

      // Handle errors
      if (error) {
        console.error("OAuth error:", error);
        navigate("/login", {
          state: {
            error: `Authentication failed. Please try again.`,
          },
        });
        return;
      }

      // Handle successful OAuth
      if (token) {
        try {
          // Store token in localStorage
          localStorage.setItem("token", token);

          // Fetch user data
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const userData = await response.json();
            setUserData(userData);
            navigate("/dashboard");
          } else {
            throw new Error("Failed to fetch user data");
          }
        } catch (err) {
          console.error("OAuth callback error:", err);
          navigate("/login", {
            state: {
              error: "Authentication failed. Please try again.",
            },
          });
        }
      } else {
        // No token, redirect to login
        navigate("/login");
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, setUserData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center">
        <Loader2 className="w-16 h-16 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Completing Sign In...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we set up your account
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
