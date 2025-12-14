import {Routes, Route} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import {Layout, AdminLayout} from "./components/layout";
import {ScrollToTop} from "./components/common";
import {ProtectedRoute, AdminProtectedRoute} from "./components/auth";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Editor from "./pages/Editor";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import RateLimitExceeded from "./pages/RateLimitExceeded";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import Templates from "./pages/Templates";
import GitHubImport from "./pages/GitHubImport";
import ATSAnalyzer from "./pages/ATSAnalyzer";
import JobSearch from "./pages/JobSearch";
import SmartJobMatchPage from "./pages/SmartJobMatchPage";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import RefundPolicy from "./pages/RefundPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import PaymentModal from "./components/common/PaymentModal";
import SubscriptionDashboard from "./pages/SubscriptionDashboard";
import AdvancedAnalytics from "./pages/AdvancedAnalytics";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import AIAnalytics from "./pages/admin/AIAnalytics";
import AIQuotaManagement from "./pages/admin/AIQuotaManagement";
import AIExtractionManagement from "./pages/admin/AIExtractionManagement";
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
            {/* TEMPORARILY HIDDEN FOR RAZORPAY COMPLIANCE - Job Search Features */}
            {/* <Route
              path="job-search"
              element={
                <ProtectedRoute>
                  <JobSearch />
                </ProtectedRoute>
              }
            /> */}
            {/* <Route
              path="smart-match"
              element={
                <ProtectedRoute>
                  <SmartJobMatchPage />
                </ProtectedRoute>
              }
            /> */}
            <Route
              path="contact"
              element={
                <ProtectedRoute>
                  <Contact />
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
            {/* Subscription Routes */}
            <Route path="pricing" element={<Pricing />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route
              path="terms-and-conditions"
              element={<TermsAndConditions />}
            />
            <Route path="refund-policy" element={<RefundPolicy />} />
            <Route path="shipping-policy" element={<ShippingPolicy />} />

            {/* Public Auth Routes */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
            <Route path="rate-limit-exceeded" element={<RateLimitExceeded />} />
            <Route path="auth/callback" element={<AuthCallback />} />

            <Route
              path="payment"
              element={
                <ProtectedRoute>
                  <PaymentModal />
                </ProtectedRoute>
              }
            />
            <Route
              path="subscription"
              element={
                <ProtectedRoute>
                  <SubscriptionDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="analytics"
              element={
                <ProtectedRoute>
                  <AdvancedAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

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
            <Route path="ai-extraction" element={<AIExtractionManagement />} />
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
