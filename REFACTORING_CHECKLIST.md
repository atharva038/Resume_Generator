# 🔧 Frontend Refactoring Checklist

**Project:** ATS Resume Generator Client  
**Created:** December 13, 2025  
**Priority:** MEDIUM-HIGH  
**Estimated Time:** 3-4 days (immediate) + 6-7 weeks (phase 2)

---

## 🔴 **CRITICAL - DO IMMEDIATELY (Before Production)**

### 1. Remove Backup File Pollution
**Priority:** CRITICAL | **Estimated Time:** 1 day

- [ ] Delete all `.bak` files in `/pages`
  - [ ] `ATSAnalyzer.jsx.bak5`
  - [ ] `Contact.jsx.bak2`, `Contact.jsx.bak3`, `Contact.jsx.bak4`
  - [ ] `Dashboard.jsx.bak2`, `Dashboard.jsx.bak3`, `Dashboard.jsx.bak4`
  - [ ] `Editor.jsx.backup`
  - [ ] `Home.jsx.bak`
  - [ ] `Templates.jsx.bak2`, `Templates.jsx.bak3`, `Templates.jsx.bak4`
  - [ ] `Upload.jsx.bak2`, `Upload.jsx.bak3`, `Upload.jsx.bak4`

- [ ] Delete all `_OLD_BACKUP` files in `/pages`
  - [ ] `Home_OLD_BACKUP.jsx`
  - [ ] `Login_OLD_BACKUP.jsx`
  - [ ] `Register_OLD_BACKUP.jsx`
  - [ ] `Contact_old_backup.jsx`
  - [ ] `Feedback_old_backup.jsx`

- [ ] Delete all `_NEW` files (use active versions)
  - [ ] `Login_NEW.jsx` (merge if needed, then delete)
  - [ ] `Register_NEW.jsx` (merge if needed, then delete)

- [ ] Delete backup template files in `/components/templates`
  - [ ] `ImpactProTemplate.jsx.backup`
  - [ ] `StrategicLeaderTemplate.jsx.backup`

- [ ] Delete miscellaneous backup files
  - [ ] `Home_old.jsx.backup`

- [ ] Remove `reorganize.sh` from `/components` (cleanup script shouldn't be in src)

**Impact:** Reduces bundle size by ~500KB, eliminates developer confusion

---

### 2. Add Code Quality Tools
**Priority:** CRITICAL | **Estimated Time:** 2 hours

- [ ] Create `.eslintrc.cjs` file
  ```javascript
  module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
      'plugin:react-hooks/recommended',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    settings: { react: { version: '18.3' } },
    plugins: ['react-refresh'],
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/prop-types': 'off', // Add PropTypes later
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  }
  ```

- [ ] Create `.prettierrc` file
  ```json
  {
    "semi": true,
    "trailingComma": "es5",
    "singleQuote": false,
    "printWidth": 80,
    "tabWidth": 2,
    "useTabs": false,
    "bracketSpacing": false,
    "arrowParens": "always"
  }
  ```

- [ ] Create `.prettierignore` file
  ```
  node_modules
  dist
  build
  .next
  coverage
  *.min.js
  package-lock.json
  ```

- [ ] Update `package.json` scripts
  ```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext js,jsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,css,md}\""
  }
  ```

- [ ] Run formatting on entire codebase
  ```bash
  npm run format
  ```

**Impact:** Ensures consistent code style, prevents common errors

---

### 3. Standardize File Naming Conventions
**Priority:** HIGH | **Estimated Time:** 3 hours

- [ ] Rename service files for consistency
  - [ ] `services/api.js` → `api/client.js`
  - [ ] `services/admin.api.js` → `api/admin.api.js`
  - [ ] `services/feedback.api.js` → `api/feedback.api.js`
  - [ ] `services/subscription.api.js` → `api/subscription.api.js`
  - [ ] Create `api/resume.api.js` (extract from main api.js)
  - [ ] Create `api/contact.api.js` (extract from main api.js)
  - [ ] Create `api/index.js` (barrel export)

- [ ] Update all imports after renaming
  - [ ] Search and replace `from "../services/api"` → `from "@/api"`
  - [ ] Update all component imports
  - [ ] Update all page imports

- [ ] Verify no broken imports
  ```bash
  npm run build
  ```

**Impact:** Improves maintainability, easier to locate files

---

### 4. Create Hooks Directory & Extract Custom Hooks
**Priority:** HIGH | **Estimated Time:** 1 day

- [ ] Create `/src/hooks` directory structure
  ```
  src/hooks/
  ├── useAuth.js
  ├── useDarkMode.js
  ├── useLocalStorage.js
  ├── useDebounce.js
  ├── useResume.js
  ├── useNavigationBlocker.js
  └── index.js
  ```

- [ ] Extract `useAuth` hook from AuthContext
  ```javascript
  // hooks/useAuth.js
  import {useContext} from "react";
  import {AuthContext} from "@/context/AuthContext";
  
  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
  };
  ```

- [ ] Extract `useDarkMode` hook from DarkModeContext
  ```javascript
  // hooks/useDarkMode.js
  import {useContext} from "react";
  import {DarkModeContext} from "@/context/DarkModeContext";
  
  export const useDarkMode = () => {
    const context = useContext(DarkModeContext);
    if (!context) {
      throw new Error("useDarkMode must be used within DarkModeProvider");
    }
    return context;
  };
  ```

- [ ] Create `useLocalStorage` hook
  ```javascript
  // hooks/useLocalStorage.js
  import {useState, useEffect} from "react";
  
  export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.error(error);
        return initialValue;
      }
    });
  
    const setValue = (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(error);
      }
    };
  
    return [storedValue, setValue];
  };
  ```

- [ ] Create `useDebounce` hook
  ```javascript
  // hooks/useDebounce.js
  import {useState, useEffect} from "react";
  
  export const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
  
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
  
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
  
    return debouncedValue;
  };
  ```

- [ ] Create `useResume` hook for resume CRUD operations
  ```javascript
  // hooks/useResume.js
  import {useState, useCallback} from "react";
  import {resumeAPI} from "@/api";
  import toast from "react-hot-toast";
  
  export const useResume = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const fetchResumes = useCallback(async () => {
      setLoading(true);
      try {
        const response = await resumeAPI.list();
        setResumes(response.data.resumes);
        setError(null);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load resumes");
      } finally {
        setLoading(false);
      }
    }, []);
  
    const deleteResume = useCallback(async (id) => {
      try {
        await resumeAPI.delete(id);
        setResumes((prev) => prev.filter((r) => r._id !== id));
        toast.success("Resume deleted successfully");
      } catch (err) {
        toast.error("Failed to delete resume");
        throw err;
      }
    }, []);
  
    const saveResume = useCallback(async (data) => {
      try {
        const response = await resumeAPI.save(data);
        toast.success("Resume saved successfully");
        return response.data;
      } catch (err) {
        toast.error("Failed to save resume");
        throw err;
      }
    }, []);
  
    return {
      resumes,
      loading,
      error,
      fetchResumes,
      deleteResume,
      saveResume,
    };
  };
  ```

- [ ] Create barrel export `hooks/index.js`
  ```javascript
  export {useAuth} from "./useAuth";
  export {useDarkMode} from "./useDarkMode";
  export {useLocalStorage} from "./useLocalStorage";
  export {useDebounce} from "./useDebounce";
  export {useResume} from "./useResume";
  export {useNavigationBlocker} from "./useNavigationBlocker";
  ```

- [ ] Update all components to use hooks from `@/hooks`

**Impact:** Improved reusability, easier testing, better code organization

---

### 5. Add Path Aliases to Vite Config
**Priority:** HIGH | **Estimated Time:** 2 hours

- [ ] Update `vite.config.js`
  ```javascript
  import {defineConfig} from "vite";
  import react from "@vitejs/plugin-react";
  import path from "path";
  
  export default defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@api": path.resolve(__dirname, "./src/api"),
        "@context": path.resolve(__dirname, "./src/context"),
        "@styles": path.resolve(__dirname, "./src/styles"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            editor: ["@tiptap/react", "@tiptap/starter-kit"],
            charts: ["recharts"],
          },
        },
      },
    },
  });
  ```

- [ ] Create `jsconfig.json` for IDE support
  ```json
  {
    "compilerOptions": {
      "target": "ES2020",
      "lib": ["ES2020", "DOM", "DOM.Iterable"],
      "module": "ESNext",
      "skipLibCheck": true,
      "moduleResolution": "bundler",
      "allowImportingTsExtensions": true,
      "resolveJsonModule": true,
      "isolatedModules": true,
      "noEmit": true,
      "jsx": "react-jsx",
      "baseUrl": ".",
      "paths": {
        "@/*": ["./src/*"],
        "@components/*": ["./src/components/*"],
        "@pages/*": ["./src/pages/*"],
        "@hooks/*": ["./src/hooks/*"],
        "@utils/*": ["./src/utils/*"],
        "@api/*": ["./src/api/*"],
        "@context/*": ["./src/context/*"],
        "@styles/*": ["./src/styles/*"]
      }
    },
    "include": ["src"],
    "exclude": ["node_modules", "dist"]
  }
  ```

- [ ] Refactor all relative imports to use aliases
  - [ ] Search: `from "../../../`
  - [ ] Replace with appropriate alias: `from "@/`
  - [ ] Run build to verify: `npm run build`

**Impact:** Cleaner imports, easier refactoring, better developer experience

---

### 6. Create Storage Abstraction Layer ✅ **COMPLETED**
**Priority:** HIGH | **Estimated Time:** 2 hours | **Actual Time:** 45 minutes

- [x] Create `utils/storage.js`
  ```javascript
  /**
   * Storage utility wrapper for localStorage with error handling
   */
  export const storage = {
    /**
     * Store data in localStorage
     * @param {string} key - Storage key
     * @param {any} value - Value to store (will be JSON stringified)
     */
    set: (key, value) => {
      try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
      } catch (error) {
        console.error(`Error storing ${key}:`, error);
      }
    },
  
    /**
     * Retrieve data from localStorage
     * @param {string} key - Storage key
     * @returns {any} Parsed value or null if not found
     */
    get: (key) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error(`Error retrieving ${key}:`, error);
        return null;
      }
    },
  
    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     */
    remove: (key) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing ${key}:`, error);
      }
    },
  
    /**
     * Clear all localStorage
     */
    clear: () => {
      try {
        localStorage.clear();
      } catch (error) {
        console.error("Error clearing storage:", error);
      }
    },
  
    /**
     * Check if key exists
     * @param {string} key - Storage key
     * @returns {boolean}
     */
    has: (key) => {
      return localStorage.getItem(key) !== null;
    },
  };
  
  /**
   * Storage keys constants
   */
  export const STORAGE_KEYS = {
    TOKEN: "token",
    USER: "user",
    THEME: "theme",
    RESUME_DRAFT: "resume_draft",
    LAST_TEMPLATE: "last_template",
  };
  ```

- [ ] Update all `localStorage.getItem()` calls
  - [ ] Replace in `api/client.js`
  - [ ] Replace in `context/AuthContext.jsx`
  - [ ] Replace in `context/DarkModeContext.jsx`
  - [ ] Replace in all components

- [ ] Example refactor:
  ```javascript
  // Before
  const token = localStorage.getItem("token");
  localStorage.setItem("token", newToken);
  
  // After
  import {storage, STORAGE_KEYS} from "@/utils/storage";
  const token = storage.get(STORAGE_KEYS.TOKEN);
  storage.set(STORAGE_KEYS.TOKEN, newToken);
  ```

**Impact:** Centralized storage logic, better error handling, easier to switch storage mechanism

---

### 7. Improve Error Handling ✅ **COMPLETED**
**Priority:** HIGH | **Estimated Time:** 4 hours | **Actual Time:** 1.5 hours

- [x] Update `utils/errorHandler.js`
  ```javascript
  import toast from "react-hot-toast";
  
  /**
   * Parse validation errors from API response
   * @param {Object} error - Error object from API
   * @returns {Object} Parsed validation errors
   */
  export const parseValidationErrors = (error) => {
    if (error.response?.data?.errors) {
      return error.response.data.errors;
    }
    return {};
  };
  
  /**
   * Get user-friendly error message
   * @param {Object} error - Error object
   * @returns {string} User-friendly message
   */
  export const getErrorMessage = (error) => {
    if (error.response) {
      // Server responded with error status
      return error.response.data?.message || "An error occurred";
    } else if (error.request) {
      // Request made but no response
      return "Network error. Please check your connection.";
    } else {
      // Something else went wrong
      return error.message || "An unexpected error occurred";
    }
  };
  
  /**
   * Handle API errors with toast notifications
   * @param {Object} error - Error object
   * @param {string} fallbackMessage - Default message if none found
   * @returns {string} Error message
   */
  export const handleApiError = (error, fallbackMessage = "An error occurred") => {
    const message = getErrorMessage(error);
    
    // Don't show toast for 401 (handled by interceptor)
    if (error.response?.status !== 401) {
      toast.error(message);
    }
    
    // Log to console in development
    if (import.meta.env.DEV) {
      console.error("API Error:", error);
    }
    
    return message;
  };
  
  /**
   * Handle specific HTTP error codes
   * @param {number} statusCode - HTTP status code
   * @param {Function} handlers - Object with handler functions
   */
  export const handleErrorByStatus = (error, handlers = {}) => {
    const status = error.response?.status;
    
    if (handlers[status]) {
      handlers[status](error);
    } else if (handlers.default) {
      handlers.default(error);
    } else {
      handleApiError(error);
    }
  };
  
  /**
   * Async error boundary wrapper
   * @param {Function} fn - Async function to wrap
   * @param {string} errorMessage - Custom error message
   */
  export const withErrorHandling = (fn, errorMessage) => {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (error) {
        handleApiError(error, errorMessage);
        throw error;
      }
    };
  };
  ```

- [ ] Update API interceptor in `api/client.js`
  ```javascript
  import {handleErrorByStatus} from "@/utils/errorHandler";
  
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      handleErrorByStatus(error, {
        401: () => {
          // Redirect to login
          storage.remove(STORAGE_KEYS.TOKEN);
          window.location.href = "/login";
        },
        403: () => {
          toast.error("You don't have permission to perform this action");
        },
        429: () => {
          toast.error("Too many requests. Please try again later.");
        },
        500: () => {
          toast.error("Server error. Please try again later.");
        },
      });
      return Promise.reject(error);
    }
  );
  ```

- [ ] Refactor try-catch blocks in components
  ```javascript
  // Before
  try {
    await api.call();
  } catch (err) {
    toast.error("Failed!");
    console.error(err);
  }
  
  // After
  import {handleApiError} from "@/utils/errorHandler";
  
  try {
    await api.call();
  } catch (err) {
    handleApiError(err, "Failed to complete operation");
  }
  ```

**Impact:** Consistent error handling, better UX, easier debugging

---

## 🟡 **IMPORTANT - DO NEXT SPRINT (Phase 2)**

### 8. Add Environment Variable Validation ✅ **COMPLETED**
**Priority:** MEDIUM | **Estimated Time:** 1 hour | **Actual Time:** 45 minutes

- [x] Create `utils/constants.js`
  ```javascript
  /**
   * Validate required environment variables
   */
  const requiredEnvVars = [
    "VITE_API_URL",
    "VITE_APP_NAME",
  ];
  
  requiredEnvVars.forEach((envVar) => {
    if (!import.meta.env[envVar]) {
      throw new Error(
        `❌ Missing required environment variable: ${envVar}\n` +
        `Please check your .env file.`
      );
    }
  });
  
  /**
   * Application configuration from environment variables
   */
  export const config = {
    apiUrl: import.meta.env.VITE_API_URL,
    appName: import.meta.env.VITE_APP_NAME || "ATS Resume Generator",
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
    isTest: import.meta.env.MODE === "test",
  };
  
  /**
   * Feature flags
   */
  export const features = {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
    enableDebug: import.meta.env.VITE_ENABLE_DEBUG === "true",
    maxUploadSize: parseInt(import.meta.env.VITE_MAX_UPLOAD_SIZE || "5242880"), // 5MB
  };
  
  /**
   * API endpoints
   */
  export const endpoints = {
    api: config.apiUrl,
    auth: `${config.apiUrl}/auth`,
    resume: `${config.apiUrl}/resume`,
    admin: `${config.apiUrl}/admin`,
  };
  ```

- [ ] Update `.env.example`
  ```env
  # API Configuration
  VITE_API_URL=http://localhost:5000/api
  VITE_APP_NAME=ATS Resume Generator
  
  # Feature Flags
  VITE_ENABLE_ANALYTICS=false
  VITE_ENABLE_DEBUG=false
  VITE_MAX_UPLOAD_SIZE=5242880
  
  # Payment (Razorpay)
  VITE_RAZORPAY_KEY_ID=your_razorpay_key
  
  # OAuth (if applicable)
  VITE_GOOGLE_CLIENT_ID=your_google_client_id
  VITE_GITHUB_CLIENT_ID=your_github_client_id
  ```

- [ ] Import constants in `api/client.js`
  ```javascript
  import {config} from "@/utils/constants";
  
  const api = axios.create({
    baseURL: config.apiUrl,
    // ...
  });
  ```

**Impact:** Prevents runtime errors from missing env vars, centralized config

---

### 9. Add Component Documentation (JSDoc) ✅ **COMPLETED**
**Priority:** MEDIUM | **Estimated Time:** 2 days | **Actual Time:** 2 hours

- [x] Add JSDoc to all templates (example: ClassicTemplate)
  ```javascript
  /**
   * ClassicTemplate - Professional ATS-optimized resume template
   * 
   * @component
   * @param {Object} props
   * @param {Object} props.resumeData - Complete resume data object
   * @param {string} props.resumeData.name - Candidate name
   * @param {Object} props.resumeData.contact - Contact information
   * @param {string} [props.resumeData.summary] - Professional summary
   * @param {Array} [props.resumeData.experience] - Work experience array
   * @param {Array} [props.resumeData.education] - Education array
   * @param {Array} [props.resumeData.skills] - Skills array
   * @param {string} [props.resumeData.selectedTheme] - Color theme (navy, burgundy, forest, etc.)
   * @param {Function} [props.onPageUsageChange] - Callback for page overflow detection
   * @param {React.Ref} ref - Forwarded ref for PDF generation
   * 
   * @example
   * <ClassicTemplate
   *   ref={templateRef}
   *   resumeData={resumeData}
   *   onPageUsageChange={handlePageUsage}
   * />
   */
  const ClassicTemplate = forwardRef(({resumeData, onPageUsageChange}, ref) => {
    // ...
  });
  ```

- [x] Document all custom hooks
  - ✅ useToggle - Enhanced with examples
  - ✅ useClickOutside - Enhanced with dropdown example
  - ✅ useDebounce - Enhanced with search bar example
  - ✅ useLocalStorage - Enhanced with settings example
  - ✅ useMediaQuery - Enhanced with responsive examples
  - ✅ useAuth, useDarkMode, useNavigationBlocker - Context re-exports

- [x] Document all API service methods
  - ✅ api.js - authAPI (3 methods), resumeAPI (13 methods), contactAPI (6 methods), mlAPI (3 methods)
  - ✅ feedback.api.js - feedbackAPI (7 methods)
  - ✅ subscription.api.js - Module-level docs + key functions

- [x] Document all utility functions
  - ✅ errorHandler.js - Already documented (10+ functions)
  - ✅ storage.js - Already documented (complete abstraction layer)
  - ✅ constants.js - Already documented (all exports)

- [x] Add README.md to each major directory explaining its purpose
  - ✅ components/templates/README.md - 600+ lines comprehensive guide
  - ✅ api/README.md - 500+ lines API documentation
  - ✅ hooks/README.md - 200+ lines hooks guide

**Result:**
- 30+ files documented with JSDoc
- 32+ API methods documented
- 14 templates documented (11 new, 3 pre-existing)
- 8 hooks enhanced with examples
- 3 comprehensive README files created (1,300+ lines total)
- Build: ✅ Passing (3002 modules, 2.77s)
- See STEP9_DOCUMENTATION_COMPLETE.md for full details

**Impact:** Better developer experience, easier onboarding, self-documenting code, improved IntelliSense

---

### 10. Add TypeScript (Incremental Migration)
**Priority:** MEDIUM | **Estimated Time:** 2 weeks

- [ ] Install TypeScript dependencies
  ```bash
  npm install -D typescript @types/react @types/react-dom @types/node
  ```

- [ ] Create `tsconfig.json`
  ```json
  {
    "compilerOptions": {
      "target": "ES2020",
      "useDefineForClassFields": true,
      "lib": ["ES2020", "DOM", "DOM.Iterable"],
      "module": "ESNext",
      "skipLibCheck": true,
      "moduleResolution": "bundler",
      "allowImportingTsExtensions": true,
      "resolveJsonModule": true,
      "isolatedModules": true,
      "noEmit": true,
      "jsx": "react-jsx",
      "strict": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noFallthroughCasesInSwitch": true,
      "baseUrl": ".",
      "paths": {
        "@/*": ["./src/*"],
        "@components/*": ["./src/components/*"],
        "@pages/*": ["./src/pages/*"],
        "@hooks/*": ["./src/hooks/*"],
        "@utils/*": ["./src/utils/*"],
        "@api/*": ["./src/api/*"],
        "@context/*": ["./src/context/*"]
      }
    },
    "include": ["src"],
    "references": [{ "path": "./tsconfig.node.json" }]
  }
  ```

- [ ] Create `src/types/index.ts` for shared types
  ```typescript
  // Resume data types
  export interface ResumeData {
    _id?: string;
    name: string;
    contact: ContactInfo;
    summary?: string;
    experience?: Experience[];
    education?: Education[];
    skills?: SkillGroup[];
    projects?: Project[];
    certifications?: Certification[];
    achievements?: string[];
    customSections?: CustomSection[];
    selectedTheme?: string;
    sectionOrder?: string[];
  }
  
  export interface ContactInfo {
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  }
  
  export interface Experience {
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    bullets?: string[];
  }
  
  export interface Education {
    degree: string;
    institution: string;
    graduationDate: string;
    gpa?: string;
  }
  
  export interface SkillGroup {
    category: string;
    items: string[];
  }
  
  export interface Project {
    name: string;
    bullets?: string[];
    technologies?: string;
  }
  
  export interface Certification {
    name: string;
    issuer?: string;
    date?: string;
  }
  
  export interface CustomSection {
    title: string;
    content: string;
  }
  
  // API response types
  export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
  }
  
  export interface ErrorResponse {
    success: false;
    message: string;
    errors?: Record<string, string>;
  }
  
  // Auth types
  export interface User {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    subscription?: {
      plan: string;
      status: string;
      expiresAt?: Date;
    };
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }
  ```

- [ ] Migration strategy (convert incrementally):
  1. Start with utility functions → `.js` to `.ts`
  2. Convert hooks → `.js` to `.ts`
  3. Convert services → `.js` to `.ts`
  4. Convert components → `.jsx` to `.tsx`
  5. Convert pages last → `.jsx` to `.tsx`

- [ ] Example: Convert `storage.js` to `storage.ts`
  ```typescript
  type StorageValue = string | number | boolean | object | null;
  
  export const storage = {
    set: <T extends StorageValue>(key: string, value: T): void => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error storing ${key}:`, error);
      }
    },
    
    get: <T extends StorageValue>(key: string): T | null => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error(`Error retrieving ${key}:`, error);
        return null;
      }
    },
    // ...
  };
  ```

**Impact:** Type safety, fewer runtime errors, better IDE support, easier refactoring

---

### 11. Add Testing Infrastructure
**Priority:** MEDIUM | **Estimated Time:** 2 weeks

- [ ] Install testing dependencies
  ```bash
  npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
  ```

- [ ] Create `vitest.config.js`
  ```javascript
  import {defineConfig} from "vitest/config";
  import react from "@vitejs/plugin-react";
  import path from "path";
  
  export default defineConfig({
    plugins: [react()],
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setup.js",
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  });
  ```

- [ ] Create test setup file `src/test/setup.js`
  ```javascript
  import {expect, afterEach} from "vitest";
  import {cleanup} from "@testing-library/react";
  import * as matchers from "@testing-library/jest-dom/matchers";
  
  expect.extend(matchers);
  
  afterEach(() => {
    cleanup();
  });
  ```

- [ ] Add test scripts to `package.json`
  ```json
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
  ```

- [ ] Create example tests
  - [ ] `hooks/useAuth.test.js`
  - [ ] `utils/storage.test.js`
  - [ ] `utils/errorHandler.test.js`
  - [ ] `components/common/Button.test.jsx` (if exists)

- [ ] Example test: `hooks/useAuth.test.js`
  ```javascript
  import {renderHook, act} from "@testing-library/react";
  import {describe, it, expect, vi} from "vitest";
  import {useAuth} from "./useAuth";
  import {AuthProvider} from "@/context/AuthContext";
  
  describe("useAuth", () => {
    it("should throw error when used outside provider", () => {
      expect(() => renderHook(() => useAuth())).toThrow();
    });
    
    it("should provide auth context", () => {
      const wrapper = ({children}) => (
        <AuthProvider>{children}</AuthProvider>
      );
      
      const {result} = renderHook(() => useAuth(), {wrapper});
      
      expect(result.current).toHaveProperty("user");
      expect(result.current).toHaveProperty("login");
      expect(result.current).toHaveProperty("logout");
    });
  });
  ```

- [ ] Set testing coverage goals
  - [ ] Utils: 80% coverage
  - [ ] Hooks: 80% coverage
  - [ ] Components: 60% coverage
  - [ ] Pages: 40% coverage

**Impact:** Prevents regressions, improves code quality, confidence in changes

---

### 12. Implement React Query for Server State
**Priority:** MEDIUM | **Estimated Time:** 1 week

- [ ] Install React Query
  ```bash
  npm install @tanstack/react-query @tanstack/react-query-devtools
  ```

- [ ] Setup QueryClient in `main.jsx`
  ```jsx
  import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
  import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
  
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
  
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <DarkModeProvider>
              <App />
            </DarkModeProvider>
          </AuthProvider>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.StrictMode>
  );
  ```

- [ ] Create query hooks in `hooks/queries/`
  ```javascript
  // hooks/queries/useResumesQuery.js
  import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
  import {resumeAPI} from "@/api";
  import toast from "react-hot-toast";
  
  export const useResumesQuery = () => {
    return useQuery({
      queryKey: ["resumes"],
      queryFn: async () => {
        const response = await resumeAPI.list();
        return response.data.resumes;
      },
    });
  };
  
  export const useDeleteResumeMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: (id) => resumeAPI.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["resumes"]});
        toast.success("Resume deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete resume");
      },
    });
  };
  
  export const useSaveResumeMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: (data) => resumeAPI.save(data),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["resumes"]});
        toast.success("Resume saved successfully");
      },
      onError: () => {
        toast.error("Failed to save resume");
      },
    });
  };
  ```

- [ ] Refactor Dashboard to use React Query
  ```jsx
  // Before
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchResumes();
  }, []);
  
  const fetchResumes = async () => {
    setLoading(true);
    try {
      const response = await resumeAPI.list();
      setResumes(response.data.resumes);
    } catch (err) {
      // ...
    } finally {
      setLoading(false);
    }
  };
  
  // After
  import {useResumesQuery, useDeleteResumeMutation} from "@/hooks/queries";
  
  const {data: resumes, isLoading} = useResumesQuery();
  const deleteResume = useDeleteResumeMutation();
  
  const handleDelete = (id) => {
    deleteResume.mutate(id);
  };
  ```

- [ ] Convert other data fetching to React Query
  - [ ] User profile queries
  - [ ] Admin dashboard queries
  - [ ] Analytics queries
  - [ ] Template queries

**Impact:** Automatic caching, optimistic updates, better UX, less boilerplate

---

### 13. Performance Optimization
**Priority:** MEDIUM | **Estimated Time:** 3 days

- [ ] Add bundle analyzer
  ```bash
  npm install -D rollup-plugin-visualizer
  ```

- [ ] Update `vite.config.js`
  ```javascript
  import {visualizer} from "rollup-plugin-visualizer";
  
  export default defineConfig({
    plugins: [
      react(),
      visualizer({
        open: true,
        filename: "dist/stats.html",
      }),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            editor: ["@tiptap/react", "@tiptap/starter-kit"],
            charts: ["recharts"],
            ui: ["framer-motion", "lucide-react"],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
  });
  ```

- [ ] Implement code splitting
  ```jsx
  // App.jsx
  import {lazy, Suspense} from "react";
  
  const Dashboard = lazy(() => import("./pages/Dashboard"));
  const Editor = lazy(() => import("./pages/Editor"));
  const Templates = lazy(() => import("./pages/Templates"));
  
  // Wrap routes with Suspense
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/editor" element={<Editor />} />
      <Route path="/templates" element={<Templates />} />
    </Routes>
  </Suspense>
  ```

- [ ] Add loading states for lazy loaded components
- [ ] Optimize images (add next-gen formats)
- [ ] Implement virtualization for long lists (react-window)
- [ ] Add `React.memo` to expensive components
- [ ] Profile with React DevTools Profiler
- [ ] Measure Core Web Vitals

**Impact:** Faster page loads, better performance scores, improved UX

---

### 14. Add Error Boundaries
**Priority:** MEDIUM | **Estimated Time:** 1 day

- [ ] Verify ErrorBoundary component exists and is implemented
  ```jsx
  // components/common/ErrorBoundary.jsx
  import {Component} from "react";
  
  class ErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = {hasError: false, error: null};
    }
  
    static getDerivedStateFromError(error) {
      return {hasError: true, error};
    }
  
    componentDidCatch(error, errorInfo) {
      console.error("Error caught by boundary:", error, errorInfo);
      // TODO: Send to error tracking service (Sentry)
    }
  
    render() {
      if (this.state.hasError) {
        return (
          <div className="error-boundary">
            <h1>Something went wrong</h1>
            <p>{this.state.error?.message}</p>
            <button onClick={() => window.location.reload()}>
              Reload Page
            </button>
          </div>
        );
      }
  
      return this.props.children;
    }
  }
  
  export default ErrorBoundary;
  ```

- [ ] Wrap main app with ErrorBoundary
  ```jsx
  // main.jsx
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
  ```

- [ ] Add route-level error boundaries
  ```jsx
  // App.jsx
  <Route
    path="/editor"
    element={
      <ErrorBoundary fallback={<EditorError />}>
        <Editor />
      </ErrorBoundary>
    }
  />
  ```

- [ ] Create fallback components for different sections
- [ ] Test error boundaries with deliberate errors

**Impact:** Graceful error handling, better UX when things go wrong

---

## 🟢 **NICE TO HAVE - FUTURE IMPROVEMENTS**

### 15. Add Storybook for Component Documentation
**Priority:** LOW | **Estimated Time:** 1 week

- [ ] Install Storybook
  ```bash
  npx storybook@latest init
  ```

- [ ] Create stories for UI components
- [ ] Create stories for templates
- [ ] Add interaction testing
- [ ] Deploy Storybook to static hosting

**Impact:** Visual component library, easier UI development, better documentation

---

### 16. Add Monitoring & Analytics
**Priority:** LOW | **Estimated Time:** 2 days

- [ ] Setup error tracking (Sentry, LogRocket, etc.)
- [ ] Add performance monitoring
- [ ] Add user analytics (Google Analytics, Mixpanel)
- [ ] Create custom event tracking
- [ ] Setup logging service

**Impact:** Better insight into production issues, user behavior tracking

---

### 17. Progressive Web App (PWA)
**Priority:** LOW | **Estimated Time:** 1 week

- [ ] Add PWA manifest
- [ ] Implement service worker
- [ ] Add offline support
- [ ] Enable install prompt
- [ ] Test on mobile devices

**Impact:** App-like experience, offline capability, better mobile UX

---

## 📊 **PROGRESS TRACKING**

### Phase 1 - Critical (Week 1)
- [ ] Remove backup files (1 day)
- [ ] Add linting/formatting (2 hours)
- [ ] Standardize naming (3 hours)
- [ ] Create hooks directory (1 day)
- [ ] Add path aliases (2 hours)
- [ ] Storage abstraction (2 hours)
- [ ] Error handling (4 hours)

**Total: 3-4 days**

---

### Phase 2 - Important (Weeks 2-7)
- [ ] Environment validation (1 hour)
- [ ] Component documentation (2 days)
- [ ] TypeScript migration (2 weeks)
- [ ] Testing infrastructure (2 weeks)
- [ ] React Query (1 week)
- [ ] Performance optimization (3 days)
- [ ] Error boundaries (1 day)

**Total: 6-7 weeks**

---

### Phase 3 - Enhancement (Future)
- [ ] Storybook (1 week)
- [ ] Monitoring (2 days)
- [ ] PWA (1 week)

**Total: 2-3 weeks**

---

## 🎯 **SUCCESS METRICS**

### Code Quality
- [ ] Zero backup files in codebase
- [ ] 100% consistent naming conventions
- [ ] All imports use path aliases
- [ ] 80%+ test coverage for utils/hooks
- [ ] Zero ESLint errors
- [ ] Zero Prettier formatting issues

### Performance
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] Bundle size < 500KB (gzipped)

### Developer Experience
- [ ] Clear folder structure
- [ ] All components documented
- [ ] Easy to onboard new developers
- [ ] Fast development feedback loop

---

## 📝 **NOTES**

### Before Starting
1. Create a new branch: `git checkout -b refactor/code-quality`
2. Commit after each major change
3. Test thoroughly after each section
4. Update this checklist as you progress

### Testing Strategy
- Run `npm run build` after each major change
- Test in development mode: `npm run dev`
- Test critical user flows manually
- Run linter: `npm run lint`
- Run formatter: `npm run format:check`

### Rollback Plan
- Keep backup branch: `main` or `master`
- Each section can be cherry-picked if needed
- Document any breaking changes

---

## ✅ **COMPLETION CHECKLIST**

- [ ] All critical tasks completed
- [ ] All tests passing
- [ ] Build successful
- [ ] No console errors
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] Deployed to staging
- [ ] QA tested
- [ ] Ready for production

---

**Last Updated:** December 13, 2025  
**Status:** In Progress  
**Next Review:** After Phase 1 completion
