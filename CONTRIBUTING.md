# Contributing to AI Resume Rebuilder

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the issue, not the person
- Help create a welcoming environment

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Gemini API key
- Git

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Click "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ats-resume-generator.git
   cd ats-resume-generator
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/ats-resume-generator.git
   ```

4. **Install dependencies**
   ```bash
   # Run setup script
   bash setup.sh
   
   # Or manually
   cd server && npm install
   cd ../client && npm install
   ```

5. **Configure environment**
   ```bash
   # Edit server/.env with your credentials
   cp server/.env.example server/.env
   ```

6. **Start development servers**
   ```bash
   # Terminal 1 - Server
   cd server && npm run dev
   
   # Terminal 2 - Client
   cd client && npm run dev
   ```

## 📋 Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### 2. Make Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

```bash
# Test server endpoints
cd server
# Add your tests here

# Test client components
cd client
# Add your tests here

# Manual testing
# Follow the testing checklist in README.md
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add new resume template"
```

Commit message conventions:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding/updating tests
- `chore:` - Maintenance tasks

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then:
1. Go to GitHub
2. Click "New Pull Request"
3. Fill in PR template
4. Wait for review

## 🎯 What to Contribute

### Good First Issues
- [ ] Add new resume template
- [ ] Improve error messages
- [ ] Add tooltips to UI elements
- [ ] Fix typos in documentation
- [ ] Add unit tests
- [ ] Improve accessibility

### Feature Requests
Check `ROADMAP.md` for planned features or propose new ones:
1. Open an issue describing the feature
2. Wait for maintainer approval
3. Start working on it

### Bug Reports
Found a bug? Please:
1. Check existing issues first
2. Create new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details

## 📝 Code Style Guidelines

### JavaScript/React

```javascript
// Use const/let, not var
const userName = 'John';
let counter = 0;

// Use arrow functions
const handleClick = () => {
  console.log('Clicked');
};

// Destructure props
const MyComponent = ({ title, description }) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
};

// Use optional chaining
const email = user?.contact?.email;

// Use template literals
const greeting = `Hello, ${userName}!`;
```

### React Component Structure

```javascript
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// 1. Component definition
const MyComponent = ({ prop1, prop2 }) => {
  // 2. Hooks
  const [state, setState] = useState('');
  
  // 3. Effects
  useEffect(() => {
    // effect logic
  }, []);
  
  // 4. Event handlers
  const handleClick = () => {
    // handler logic
  };
  
  // 5. Helper functions
  const formatData = (data) => {
    return data.toUpperCase();
  };
  
  // 6. Early returns
  if (!prop1) return null;
  
  // 7. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 8. PropTypes
MyComponent.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number
};

export default MyComponent;
```

### CSS/Tailwind

```jsx
// Use Tailwind utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <h2 className="text-xl font-bold text-gray-900">Title</h2>
</div>

// Extract repeated classes to components or CSS
// See src/index.css for custom classes
```

### Backend (Express)

```javascript
// Use async/await with try-catch
export const myController = async (req, res) => {
  try {
    const data = await MyModel.findById(req.params.id);
    
    if (!data) {
      return res.status(404).json({ error: 'Not found' });
    }
    
    res.json({ data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Validate input
if (!req.body.email) {
  return res.status(400).json({ error: 'Email is required' });
}

// Use meaningful variable names
const userEmail = req.body.email;
const resumeData = await Resume.findById(id);
```

## 🧪 Testing Guidelines

### Manual Testing Checklist
- [ ] Feature works in Chrome, Firefox, Safari
- [ ] Mobile responsiveness verified
- [ ] Error cases handled gracefully
- [ ] Loading states display correctly
- [ ] Success messages appear
- [ ] Console has no errors

### Writing Tests (Future)

```javascript
// Example unit test (Jest)
describe('parseResumeWithAI', () => {
  it('should parse resume text into structured JSON', async () => {
    const mockText = 'John Doe\njohn@example.com';
    const result = await parseResumeWithAI(mockText);
    
    expect(result.name).toBe('John Doe');
    expect(result.contact.email).toBe('john@example.com');
  });
});

// Example component test (React Testing Library)
import { render, screen } from '@testing-library/react';

test('renders upload button', () => {
  render(<Upload />);
  const button = screen.getByText(/upload resume/i);
  expect(button).toBeInTheDocument();
});
```

## 📚 Documentation

### Code Comments

```javascript
/**
 * Parse raw resume text into structured JSON using Gemini AI
 * @param {string} resumeText - Raw extracted text from resume
 * @returns {Promise<Object>} - Structured resume data
 * @throws {Error} - If parsing fails or API error occurs
 */
export async function parseResumeWithAI(resumeText) {
  // Implementation
}
```

### README Updates
If your PR changes functionality:
- Update README.md
- Update API_TESTING.md (if API changes)
- Update QUICK_START.md (if setup changes)
- Add/update screenshots if UI changes

## 🔍 Pull Request Process

### PR Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No console.log() statements
- [ ] No commented-out code
- [ ] Changes tested manually
- [ ] No merge conflicts

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
How was this tested?

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Changes tested
```

### Review Process
1. Maintainer reviews code
2. Requests changes if needed
3. You update PR based on feedback
4. Maintainer approves and merges

## 🐛 Debugging Tips

### Server Issues
```bash
# Check server logs
cd server
npm run dev

# Test endpoints with cURL
curl http://localhost:5000/api/health
```

### Client Issues
```bash
# Check browser console
# Chrome DevTools: F12 or Cmd+Option+I

# Check network requests
# Network tab in DevTools
```

### Database Issues
```bash
# Check MongoDB connection
# Verify URI in .env
# Check MongoDB Atlas IP whitelist
```

## 🤔 Questions?

- Check existing issues on GitHub
- Review documentation (README.md, etc.)
- Ask in discussions
- Contact maintainers

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Every contribution, no matter how small, is appreciated!

---

**Happy Coding! 🚀**
