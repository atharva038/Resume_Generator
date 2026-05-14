# Frontend Implementation Documentation

## 1. Overview
The frontend of the SmartNShine ATS Resume Generator is built as a feature-rich Single Page Application (SPA) using React.js. It leverages modern web development practices including component-based architecture, client-side routing, global state management, and lazy loading for optimized performance.

## 2. Technology Stack
*   **Core Library**: React (v18)
*   **Build Tool**: Vite
*   **Routing**: React Router DOM (v7)
*   **Styling**: Tailwind CSS, Framer Motion (for animations)
*   **Icons**: Lucide React, React Icons
*   **HTTP Client**: Axios
*   **Rich Text Editor**: Tiptap
*   **Data Visualization**: Recharts
*   **Utilities**: React DnD (Drag and Drop), Yup (Validation), React Hot Toast (Notifications)

## 3. Architecture & Directory Structure
The frontend codebase follows a modular organization within the `client/src` directory:

*   **`api/`**: Centralized API call methods (`admin.api.js`, `feedback.api.js`, `interview.api.js`, etc.) using Axios instances. 
*   **`components/`**: Reusable UI components further divided into:
    *   `auth/`: Route protection and auth modals (`ProtectedRoute.jsx`, `BlockableLink.jsx`).
    *   `common/`: Shared UI elements (`SEO.jsx`, `DarkModeToggle.jsx`, Modals, Cards).
    *   `editor/`: Core resume editor components (Sections, Panels, Previews).
    *   `features/`: Distinct feature modules like GitHub Extractor and ML-based Job Match.
    *   `layout/`: Standard layout shells (`Navbar.jsx`, `Footer.jsx`, `MainLayout.jsx`, etc.).
    *   `templates/`: A rich set of printable resume templates (`ModernTemplate`, `Creative2Template`, etc.).
    *   `ui/`: Base design system components (`Button`, `Card`, `Badge`).
*   **`context/`**: React Context providers for global state:
    *   `AuthContext.jsx`: Manages user authentication state.
    *   `DarkModeContext.jsx`: Handles theme toggling.
    *   `NavigationBlockerContext.jsx`: Prevents accidental navigation during edits.
*   **`hooks/`**: Custom React hooks (`useAuth`, `useDarkMode`, `useEditorPersistence`, etc.) to encapsulate complex logic.
*   **`pages/`**: Top-level route components representing complete views (`Home`, `Editor`, `Dashboard`, `ATSAnalyzer`, `AIInterview`, etc.). Includes a dedicated sub-directory for `admin/` pages.
*   **`utils/`**: Helper functions, constants, validation schemas, and scoring logic.

## 4. State Management and Data Flow
The application deliberately avoids heavy state management libraries like Redux, instead opting for a combination of:
1.  **React Context**: Used strictly for global application state bounds to the user session, theme, and application shell navigation.
2.  **Custom Hooks**: Business logic that requires state (e.g., handling dragging inside the editor, persistent auto-saves) is wrapped into custom hooks (`useEditorPersistence`, `useSectionCompletion`) and consumed deeply by components.
3.  **Prop Drilling**: Used thoughtfully only for purely presentational hierarchies.

## 5. Routing Strategy (App.jsx)
The application handles routing using `react-router-dom` with a mix of immediate and deferred loading:
*   **Critical Paths**: Immediate loading for core entry pages (`Home`, `Login`, `Register`).
*   **Code Splitting**: Extensively leverages `React.lazy` and `<Suspense>` for feature-heavy modules like the editor (`/editor`), dashboards (`/admin/*`), analyzer (`/ats-analyzer`), and AI modules (`/interview`, `/smart-match`).
*   **Protected Routes**: Wraps standard sensitive routes with `<ProtectedRoute>` and administrative routes with `<AdminProtectedRoute>`. These Higher-Order Components automatically verify and bounce unauthorized sessions back to login.

## 6. Key Frontend Modules

### 6.1 Resume Editor (`/editor`)
A highly interactive module allowing users to input their data section by section. It incorporates real-time preview updating, field validation using `yup`, and rich text editing via `tiptap`. 

### 6.2 Templates System (`components/templates/`)
Implements over 10 different resume designs. Each template is fundamentally an isolated React component responsible for consuming a standardized JSON representation of user data and rendering it inside a printable layout container.

### 6.3 ATS Analyzer & AI Integration
Connects to the Python-based ATS logic on the backend. Frontend handles drag-and-drop file inputs (using `react-dropzone`), asynchronous polling (if applicable), and elegantly visualizes match scores and improvement points using `recharts` and interactive progress bars.

### 6.4 Admin Dashboard (`/admin/dashboard`)
A dedicated suite accessible only to administrators, utilizing a specialized layout (`AdminLayout`). It includes real-time telemetry rendering, user moderation tools, and quota management for AI usage.

## 7. Performance & Developer Experience
*   **Error Boundaries**: A global `<ErrorBoundary>` encapsulates the router to ensure runtime UI errors do not completely crash the application framework.
*   **Development Tools**: Integration of `eslint` and `prettier` ensure clean standard code representation. 
*   **SEO Optimization**: Use of `react-helmet-async` for dynamically updating Meta headers and schemas on individual route basis (e.g., on public template browsing).
