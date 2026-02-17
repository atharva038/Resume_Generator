import {Routes, Route} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import {lazy, Suspense} from "react";
import {Layout, AdminLayout} from "./components/layout";
import {ScrollToTop} from "./components/common";
import {ProtectedRoute, AdminProtectedRoute} from "./components/auth";

// Critical pages - loaded immediately
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Lazy load non-critical pages for better performance
const Upload = lazy(() => import("./pages/Upload"));
const Editor = lazy(() => import("./pages/Editor"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const RateLimitExceeded = lazy(() => import("./pages/RateLimitExceeded"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Templates = lazy(() => import("./pages/Templates"));
const GitHubImport = lazy(() => import("./pages/GitHubImport"));
const ATSAnalyzer = lazy(() => import("./pages/ATSAnalyzer"));
const JobSearch = lazy(() => import("./pages/JobSearch"));
const SmartJobMatchPage = lazy(() => import("./pages/SmartJobMatchPage"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Pricing = lazy(() => import("./pages/Pricing"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy"));
const PaymentModal = lazy(() => import("./components/common/PaymentModal"));
const SubscriptionDashboard = lazy(
  () => import("./pages/SubscriptionDashboard")
);
const Profile = lazy(() => import("./pages/Profile"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const AIAnalytics = lazy(() => import("./pages/admin/AIAnalytics"));
const AIQuotaManagement = lazy(() => import("./pages/admin/AIQuotaManagement"));
const AIExtractionManagement = lazy(
  () => import("./pages/admin/AIExtractionManagement")
);
const ContactMessages = lazy(() => import("./pages/admin/ContactMessages"));
const AdminFeedback = lazy(() => import("./pages/admin/AdminFeedback"));
const AdminLogs = lazy(() => import("./pages/admin/AdminLogs"));
const TemplateManagement = lazy(
  () => import("./pages/admin/TemplateManagement")
);
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const Earnings = lazy(() => import("./pages/admin/Earnings"));
const AIInterview = lazy(() => import("./pages/AIInterview"));
const InterviewHistory = lazy(() => import("./pages/InterviewHistory"));
const InterviewResult = lazy(() => import("./pages/InterviewResult"));

import {DarkModeProvider} from "./context/DarkModeContext";
import {NavigationBlockerProvider} from "./context/NavigationBlockerContext";

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

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
        <Suspense fallback={<LoadingFallback />}>
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
              path="my-resumes"
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
              <Route
                path="rate-limit-exceeded"
                element={<RateLimitExceeded />}
              />
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
              {/* Temporarily disabled - Advanced Analytics */}
              {/* <Route
              path="analytics"
              element={
                <ProtectedRoute>
                  <AdvancedAnalytics />
                </ProtectedRoute>
              }
            /> */}
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* AI Interview Routes */}
              <Route
                path="interview"
                element={
                  <ProtectedRoute>
                    <AIInterview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="interview/history"
                element={
                  <ProtectedRoute>
                    <InterviewHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="interview/result/:sessionId"
                element={
                  <ProtectedRoute>
                    <InterviewResult />
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
              <Route path="earnings" element={<Earnings />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="templates" element={<TemplateManagement />} />
              <Route path="ai-analytics" element={<AIAnalytics />} />
              <Route path="ai-quota" element={<AIQuotaManagement />} />
              <Route
                path="ai-extraction"
                element={<AIExtractionManagement />}
              />
              <Route path="contacts" element={<ContactMessages />} />
              <Route path="feedback" element={<AdminFeedback />} />
              <Route path="logs" element={<AdminLogs />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </Suspense>
      </NavigationBlockerProvider>
    </DarkModeProvider>
  );
}

export default App;
