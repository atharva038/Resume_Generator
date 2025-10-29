import {Routes, Route} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Editor from "./pages/Editor";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Templates from "./pages/Templates";
import GitHubImport from "./pages/GitHubImport";
import ATSAnalyzer from "./pages/ATSAnalyzer";
import Contact from "./pages/Contact";
import Feedback from "./pages/Feedback";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import AIAnalytics from "./pages/admin/AIAnalytics";
import AIQuotaManagement from "./pages/admin/AIQuotaManagement";
import ContactMessages from "./pages/admin/ContactMessages";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminLogs from "./pages/admin/AdminLogs";
import TemplateManagement from "./pages/admin/TemplateManagement";
import AdminSettings from "./pages/admin/AdminSettings";
import {DarkModeProvider} from "./context/DarkModeContext";
import {NavigationBlockerProvider} from "./context/NavigationBlockerContext";

function App() {
  return (
    <DarkModeProvider>
      <NavigationBlockerProvider>
        <ScrollToTop />
        {/* Global Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            // Default options
            duration: 3000,
            style: {
              background: "var(--toast-bg, #fff)",
              color: "var(--toast-text, #333)",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
            // Success
            success: {
              style: {
                background: "#10b981",
                color: "#fff",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#10b981",
              },
            },
            // Error
            error: {
              style: {
                background: "#ef4444",
                color: "#fff",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#ef4444",
              },
            },
            // Loading
            loading: {
              style: {
                background: "#3b82f6",
                color: "#fff",
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            {/* Protected Routes - Require Authentication */}
            <Route
              path="upload"
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />
            <Route
              path="editor"
              element={
                <ProtectedRoute>
                  <Editor />
                </ProtectedRoute>
              }
            />
            <Route
              path="templates"
              element={
                <ProtectedRoute>
                  <Templates />
                </ProtectedRoute>
              }
            />
            <Route
              path="github-import"
              element={
                <ProtectedRoute>
                  <GitHubImport />
                </ProtectedRoute>
              }
            />
            <Route
              path="ats-analyzer"
              element={
                <ProtectedRoute>
                  <ATSAnalyzer />
                </ProtectedRoute>
              }
            />
            <Route
              path="contact"
              element={
                <ProtectedRoute>
                  <Contact />
                </ProtectedRoute>
              }
            />
            <Route
              path="feedback"
              element={
                <ProtectedRoute>
                  <Feedback />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            {/* Public Routes */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* 404 Not Found - Must be last route in this Route group */}
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin Routes - Separate Layout */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="templates" element={<TemplateManagement />} />
            <Route path="ai-analytics" element={<AIAnalytics />} />
            <Route path="ai-quota" element={<AIQuotaManagement />} />
            <Route path="contacts" element={<ContactMessages />} />
            <Route path="feedback" element={<AdminFeedback />} />
            <Route path="logs" element={<AdminLogs />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </NavigationBlockerProvider>
    </DarkModeProvider>
  );
}

export default App;
