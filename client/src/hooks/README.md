# Custom Hooks

This directory contains reusable React custom hooks for the ATS Resume Generator application.

## 📋 Available Hooks

### State Management
- **useToggle** - Boolean state with toggle, setTrue, setFalse functions
- **useLocalStorage** - Sync state with localStorage automatically

### UI Interactions
- **useClickOutside** - Detect clicks outside a referenced element
- **useMediaQuery** - Track media query matches (responsive design)

### Performance
- **useDebounce** - Debounce rapidly changing values

### Context Re-exports
- **useAuth** - Authentication context (from AuthContext)
- **useDarkMode** - Dark mode context (from DarkModeContext)
- **useNavigationBlocker** - Navigation blocking (from NavigationBlockerContext)

## 📖 Usage Examples

### useToggle
```javascript
import {useToggle} from '@/hooks';

function Modal() {
  const [isOpen, toggleOpen, openModal, closeModal] = useToggle(false);
  
  return (
    <>
      <button onClick={openModal}>Open Modal</button>
      {isOpen && (
        <div>
          <p>Modal Content</p>
          <button onClick={closeModal}>Close</button>
        </div>
      )}
    </>
  );
}
```

### useClickOutside
```javascript
import {useRef} from 'react';
import {useClickOutside} from '@/hooks';

function Dropdown() {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  
  useClickOutside(dropdownRef, () => setIsOpen(false));
  
  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && <div>Dropdown Content</div>}
    </div>
  );
}
```

### useDebounce
```javascript
import {useState, useEffect} from 'react';
import {useDebounce} from '@/hooks';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      // API call only happens 500ms after user stops typing
      fetchSearchResults(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  
  return (
    <input 
      value={searchTerm} 
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### useLocalStorage
```javascript
import {useLocalStorage} from '@/hooks';

function Settings() {
  const [theme, setTheme] = useLocalStorage('app-theme', 'light');
  const [fontSize, setFontSize] = useLocalStorage('font-size', 14);
  
  return (
    <div>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme (Current: {theme})
      </button>
      <input 
        type="number" 
        value={fontSize} 
        onChange={(e) => setFontSize(parseInt(e.target.value))} 
      />
    </div>
  );
}
```

### useMediaQuery
```javascript
import {useMediaQuery} from '@/hooks';

function ResponsiveLayout() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  
  return (
    <div>
      {isMobile && <MobileView />}
      {isDesktop && <DesktopView />}
      {prefersDark && <p>User prefers dark mode</p>}
    </div>
  );
}
```

### useAuth
```javascript
import {useAuth} from '@/hooks';

function Dashboard() {
  const {user, login, logout, isAuthenticated, loading} = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }
  
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### useDarkMode
```javascript
import {useDarkMode} from '@/hooks';

function ThemeToggle() {
  const {isDarkMode, toggleDarkMode, setDarkMode, setLightMode} = useDarkMode();
  
  return (
    <button onClick={toggleDarkMode}>
      {isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  );
}
```

## ✅ Best Practices

1. **Use hooks at top level** - Never inside conditions or loops
2. **Prefix with "use"** - Follow React naming convention
3. **Keep focused** - One responsibility per hook
4. **Document thoroughly** - Add JSDoc comments
5. **Test edge cases** - Handle null/undefined gracefully

## 🔧 Creating New Hooks

### Template

```javascript
import {useState, useEffect} from 'react';

/**
 * useCustomHook - Brief description
 * 
 * @param {type} param - Parameter description
 * @returns {type} Return value description
 * 
 * @example
 * const value = useCustomHook(initialValue);
 */
export const useCustomHook = (param) => {
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // Effect logic
  }, [param]);
  
  return state;
};
```

### Guidelines

1. Add JSDoc documentation
2. Include usage example
3. Export from `index.js`
4. Add to this README
5. Write tests (if applicable)

## 📚 Related Documentation

- [Components README](../components/README.md)
- [Utils README](../utils/README.md)
- [API Services README](../api/README.md)

---

For full documentation, see each hook's source file with detailed JSDoc comments.
