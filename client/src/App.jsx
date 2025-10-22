import {Routes, Route} from "react-router-dom";
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
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import AIAnalytics from "./pages/admin/AIAnalytics";
import ContactMessages from "./pages/admin/ContactMessages";
import AdminLogs from "./pages/admin/AdminLogs";
import TemplateManagement from "./pages/admin/TemplateManagement";
import AdminSettings from "./pages/admin/AdminSettings";
import {DarkModeProvider} from "./context/DarkModeContext";

function App() {
  return (
    <DarkModeProvider>
      <ScrollToTop />
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
          <Route path="contacts" element={<ContactMessages />} />
          <Route path="logs" element={<AdminLogs />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </DarkModeProvider>
  );
}

export default App;
