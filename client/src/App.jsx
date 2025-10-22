import {Routes, Route} from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
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
          <Route path="upload" element={<Upload />} />
          <Route path="editor" element={<Editor />} />
          <Route path="templates" element={<Templates />} />
          <Route path="github-import" element={<GitHubImport />} />
          <Route path="ats-analyzer" element={<ATSAnalyzer />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </DarkModeProvider>
  );
}

export default App;
