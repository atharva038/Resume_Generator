import {Routes, Route} from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
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
      </Routes>
    </DarkModeProvider>
  );
}

export default App;
