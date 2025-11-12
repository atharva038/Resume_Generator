import {useState} from 'react';
import {ChevronRight, ChevronDown, Database, Server, Smartphone, Cpu, Lock, Zap, Users, FileText, Settings, BarChart, TrendingUp, DollarSign, Target, Rocket, Globe, Award, ShoppingCart, CreditCard, Star} from 'lucide-react';
import { SYSTEM_CONFIG } from '../config/systemConfig';
import { REVENUE_CONFIG } from '../config/revenueConfig';
import { ROADMAP_CONFIG } from '../config/roadmapConfig';
import { GROWTH_CONFIG } from '../config/growthConfig';

const SystemFlowchart = () => {
  const [activeTab, setActiveTab] = useState('architecture');
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const FlowBox = ({title, items, color = 'blue', icon: Icon}) => (
    <div className={`border-2 border-${color}-500 bg-${color}-50 dark:bg-${color}-900/20 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all`}>
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon className={`w-5 h-5 text-${color}-600`} />}
        <h4 className={`font-bold text-${color}-700 dark:text-${color}-300`}>{title}</h4>
      </div>
      {items && (
        <ul className="space-y-1 text-sm">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className={`text-${color}-500 mt-1`}>•</span>
              <span className="text-gray-700 dark:text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const FlowArrow = ({direction = 'down', label}) => (
    <div className="flex items-center justify-center my-2">
      {direction === 'down' ? (
        <div className="flex flex-col items-center">
          <div className="w-0.5 h-8 bg-gray-400"></div>
          <ChevronDown className="w-6 h-6 text-gray-500" />
          {label && <span className="text-xs text-gray-500 mt-1">{label}</span>}
        </div>
      ) : (
        <div className="flex items-center">
          <div className="h-0.5 w-8 bg-gray-400"></div>
          <ChevronRight className="w-6 h-6 text-gray-500" />
          {label && <span className="text-xs text-gray-500 ml-1">{label}</span>}
        </div>
      )}
    </div>
  );

  const ExpandableSection = ({title, children, icon: Icon}) => {
    const isExpanded = expandedSections[title];
    return (
      <div className="border border-gray-300 dark:border-gray-600 rounded-lg mb-4">
        <button
          onClick={() => toggleSection(title)}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all rounded-lg"
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            <span className="font-semibold text-gray-800 dark:text-white">{title}</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          )}
        </button>
        {isExpanded && (
          <div className="p-4 bg-white dark:bg-gray-900">
            {children}
          </div>
        )}
      </div>
    );
  };

  const ArchitectureView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FlowBox
          title="Frontend (React)"
          color="blue"
          icon={Smartphone}
          items={[
            'React 18 + Vite',
            'Tailwind CSS',
            'React Router',
            'TipTap Editor',
            'React Hot Toast',
            'Axios HTTP Client'
          ]}
        />
        <FlowBox
          title="Backend (Node.js)"
          color="green"
          icon={Server}
          items={[
            'Express.js',
            'JWT Auth',
            'Passport OAuth',
            'Multer Upload',
            'Rate Limiting',
            'Input Validation'
          ]}
        />
        <FlowBox
          title="Database (MongoDB)"
          color="purple"
          icon={Database}
          items={[
            'Users Collection',
            'Resumes Collection',
            'AI Usage Tracking',
            'Contact Messages',
            'Feedback Data',
            'Admin Logs'
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FlowBox
          title="AI Integration"
          color="orange"
          icon={Cpu}
          items={[
            'Google Gemini AI',
            'Content Enhancement',
            'Skills Categorization',
            'Job Matching',
            'Quota Management',
            'Usage Analytics'
          ]}
        />
        <FlowBox
          title="External APIs"
          color="pink"
          icon={Zap}
          items={[
            'Adzuna Job Search',
            'Google OAuth',
            'GitHub OAuth',
            'GitHub Profile Data',
            'Job Listings API'
          ]}
        />
      </div>
    </div>
  );

  const UserFlowView = () => (
    <div className="space-y-4">
      <ExpandableSection title="1. User Registration & Login" icon={Users}>
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Registration Flow</h5>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded text-xs font-mono">POST</span>
                <code>/api/auth/register</code>
              </div>
              <p className="text-gray-600 dark:text-gray-400">→ Validate email & password</p>
              <p className="text-gray-600 dark:text-gray-400">→ Hash password with bcrypt</p>
              <p className="text-gray-600 dark:text-gray-400">→ Create user in MongoDB</p>
              <p className="text-gray-600 dark:text-gray-400">→ Return success message</p>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h5 className="font-semibold text-green-700 dark:text-green-300 mb-2">Login Flow</h5>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-green-200 dark:bg-green-800 rounded text-xs font-mono">POST</span>
                <code>/api/auth/login</code>
              </div>
              <p className="text-gray-600 dark:text-gray-400">→ Find user by email</p>
              <p className="text-gray-600 dark:text-gray-400">→ Compare password hash</p>
              <p className="text-gray-600 dark:text-gray-400">→ Generate JWT token (7 days)</p>
              <p className="text-gray-600 dark:text-gray-400">→ Return token + user data</p>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h5 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">OAuth Flow (Google/GitHub)</h5>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-purple-200 dark:bg-purple-800 rounded text-xs font-mono">GET</span>
                <code>/api/auth/google</code>
              </div>
              <p className="text-gray-600 dark:text-gray-400">→ Redirect to OAuth provider</p>
              <p className="text-gray-600 dark:text-gray-400">→ User grants permission</p>
              <p className="text-gray-600 dark:text-gray-400">→ Callback to /api/auth/google/callback</p>
              <p className="text-gray-600 dark:text-gray-400">→ Find or create user</p>
              <p className="text-gray-600 dark:text-gray-400">→ Generate JWT & redirect to client</p>
            </div>
          </div>
        </div>
      </ExpandableSection>

      <ExpandableSection title="2. Resume Creation" icon={FileText}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Upload PDF/DOCX</h5>
            <div className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
              <p>• Select file (&lt;5MB)</p>
              <p>• POST /api/resume/upload</p>
              <p>• Multer processes file</p>
              <p>• AI extracts data</p>
              <p>• Save to MongoDB</p>
              <p>• Redirect to Editor</p>
            </div>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h5 className="font-semibold text-green-700 dark:text-green-300 mb-2">GitHub Import</h5>
            <div className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
              <p>• Enter GitHub username</p>
              <p>• POST /api/github/import</p>
              <p>• Fetch profile data</p>
              <p>• Fetch repositories</p>
              <p>• AI formats as resume</p>
              <p>• Redirect to Editor</p>
            </div>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <h5 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Start from Scratch</h5>
            <div className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
              <p>• Click "Create New"</p>
              <p>• Choose template</p>
              <p>• Initialize empty resume</p>
              <p>• POST /api/resume/save</p>
              <p>• Open in Editor</p>
              <p>• Fill sections manually</p>
            </div>
          </div>
        </div>
      </ExpandableSection>

      <ExpandableSection title="3. Resume Editor (Core Feature)" icon={FileText}>
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
            <h5 className="font-semibold text-gray-800 dark:text-white mb-3">Editor Layout</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h6 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Left Panel (60%)</h6>
                <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                  <li>✏️ Personal Information</li>
                  <li>📝 Professional Summary</li>
                  <li>🛠️ Skills (AI Categorize)</li>
                  <li>💼 Experience (AI Enhance)</li>
                  <li>🎓 Education</li>
                  <li>🚀 Projects (AI Enhance)</li>
                  <li>📜 Certifications</li>
                  <li>🏆 Achievements (AI Segregate)</li>
                  <li>➕ Custom Sections</li>
                </ul>
              </div>
              <div>
                <h6 className="font-semibold text-green-700 dark:text-green-300 mb-2">Right Panel (40%)</h6>
                <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                  <li>👁️ Live Resume Preview</li>
                  <li>📊 ATS Score Card (Real-time)</li>
                  <li>🎯 Job-Specific Score</li>
                  <li>💡 Recommendations Panel</li>
                  <li>⚠️ Page Limit Warning</li>
                  <li>📏 Character Counters</li>
                  <li>📥 Download PDF Button</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <h5 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">AI Enhancement Features</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-semibold mb-1">Content Enhancement</p>
                <code className="text-xs">POST /api/resume/enhance</code>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Improves clarity, adds ATS keywords, enhances impact</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Skills Categorization</p>
                <code className="text-xs">POST /api/resume/categorize-skills</code>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Auto-groups skills into logical categories</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Achievement Segregation</p>
                <code className="text-xs">POST /api/resume/segregate-achievements</code>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Extracts and formats achievements professionally</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Summary Generation</p>
                <code className="text-xs">POST /api/resume/generate-summary</code>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Creates compelling professional summary</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <h5 className="font-semibold text-red-700 dark:text-red-300 mb-2">One-Page Constraint System</h5>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>📏 <strong>Page Size:</strong> A4 (210mm × 297mm) - Strictly enforced</p>
              <p>⚠️ <strong>Overflow Detection:</strong> Real-time monitoring (500ms interval)</p>
              <p>🔢 <strong>Character Limits:</strong> Summary (600), Experience (400/entry), Projects (300/entry)</p>
              <p>🎨 <strong>Visual Feedback:</strong> Green (safe) → Yellow (warning) → Red (over limit)</p>
              <p>💬 <strong>User Alerts:</strong> Floating warning + toast notification on overflow</p>
            </div>
          </div>
        </div>
      </ExpandableSection>

      <ExpandableSection title="4. Additional Features" icon={Zap}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">ATS Analyzer</h5>
            <div className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
              <p>• Paste job description</p>
              <p>• POST /api/ats/analyze</p>
              <p>• AI compares resume vs JD</p>
              <p>• Calculate match score</p>
              <p>• Identify missing keywords</p>
              <p>• Provide recommendations</p>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h5 className="font-semibold text-green-700 dark:text-green-300 mb-2">Job Search</h5>
            <div className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
              <p>• Enter keywords & location</p>
              <p>• POST /api/jobs/search</p>
              <p>• Query Adzuna API</p>
              <p>• Apply filters & pagination</p>
              <p>• Display job listings</p>
              <p>• Click to view details</p>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h5 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Smart Job Match</h5>
            <div className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
              <p>• Analyze user resume</p>
              <p>• POST /api/jobs/smart-match</p>
              <p>• Fetch relevant jobs</p>
              <p>• AI calculates match %</p>
              <p>• Rank by compatibility</p>
              <p>• Show top matches</p>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <h5 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">Templates</h5>
            <div className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
              <p>• 9 professional templates</p>
              <p>• Classic, Modern, Minimal</p>
              <p>• Professional, Executive</p>
              <p>• Tech, Creative, Academic</p>
              <p>• ATS scores: 88-98</p>
              <p>• Switch anytime</p>
            </div>
          </div>
        </div>
      </ExpandableSection>
    </div>
  );

  const AdminFlowView = () => (
    <div className="space-y-4">
      <ExpandableSection title="Admin Dashboard" icon={BarChart}>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <Users className="w-8 h-8 mx-auto text-blue-500 mb-2" />
              <h6 className="font-semibold">Total Users</h6>
              <p className="text-2xl font-bold text-blue-600">1,234</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <FileText className="w-8 h-8 mx-auto text-green-500 mb-2" />
              <h6 className="font-semibold">Total Resumes</h6>
              <p className="text-2xl font-bold text-green-600">5,678</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <Cpu className="w-8 h-8 mx-auto text-orange-500 mb-2" />
              <h6 className="font-semibold">AI Requests</h6>
              <p className="text-2xl font-bold text-orange-600">12,345</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <Zap className="w-8 h-8 mx-auto text-purple-500 mb-2" />
              <h6 className="font-semibold">Active Today</h6>
              <p className="text-2xl font-bold text-purple-600">456</p>
            </div>
          </div>
        </div>
      </ExpandableSection>

      <ExpandableSection title="User Management" icon={Users}>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
            <span className="font-semibold">View All Users</span>
            <code className="text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">GET /api/admin/users</code>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
            <span className="font-semibold">Update User Status</span>
            <code className="text-xs bg-green-100 dark:bg-green-900 px-2 py-1 rounded">PATCH /api/admin/users/:id/status</code>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
            <span className="font-semibold">Change User Role</span>
            <code className="text-xs bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">PATCH /api/admin/users/:id/role</code>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
            <span className="font-semibold">Delete User</span>
            <code className="text-xs bg-red-100 dark:bg-red-900 px-2 py-1 rounded">DELETE /api/admin/users/:id</code>
          </div>
        </div>
      </ExpandableSection>

      <ExpandableSection title="AI Analytics & Quota" icon={Cpu}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <h5 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">AI Analytics</h5>
            <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
              <li>• View AI requests by user</li>
              <li>• Monitor quota usage</li>
              <li>• Track API costs</li>
              <li>• Analyze usage trends</li>
              <li>• Export reports</li>
            </ul>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h5 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Quota Management</h5>
            <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
              <li>• Set user AI limits</li>
              <li>• Tier management (Free/Pro/Enterprise)</li>
              <li>• Reset daily quotas</li>
              <li>• Monitor abuse</li>
              <li>• Auto-throttling</li>
            </ul>
          </div>
        </div>
      </ExpandableSection>

      <ExpandableSection title="Content Management" icon={Settings}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-l-4 border-blue-500 pl-3">
            <h6 className="font-semibold text-blue-700 dark:text-blue-300">Contact Messages</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">View, respond, mark as resolved</p>
          </div>
          <div className="border-l-4 border-green-500 pl-3">
            <h6 className="font-semibold text-green-700 dark:text-green-300">Feedback</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">Review user feedback, track status</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-3">
            <h6 className="font-semibold text-purple-700 dark:text-purple-300">Templates</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">Enable/disable, manage templates</p>
          </div>
        </div>
      </ExpandableSection>
    </div>
  );

  const SecurityView = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-lg">
        <h4 className="font-bold text-xl mb-4 flex items-center gap-2">
          <Lock className="w-6 h-6 text-red-600" />
          9-Layer Security Stack
        </h4>
        <div className="space-y-3">
          {[
            {layer: 1, name: 'CORS', desc: 'Allow only CLIENT_URL origin', color: 'blue'},
            {layer: 2, name: 'Helmet', desc: 'Security headers protection', color: 'green'},
            {layer: 3, name: 'Rate Limiter', desc: 'Prevent brute force & DDoS', color: 'yellow'},
            {layer: 4, name: 'Validation', desc: 'Input sanitization & type checking', color: 'orange'},
            {layer: 5, name: 'Authentication', desc: 'JWT token verification', color: 'red'},
            {layer: 6, name: 'Authorization', desc: 'Role-based access control', color: 'purple'},
            {layer: 7, name: 'AI Quota', desc: 'Usage limits enforcement', color: 'pink'},
            {layer: 8, name: 'File Upload', desc: 'Type & size validation', color: 'indigo'},
            {layer: 9, name: 'Error Handler', desc: 'Sanitized error responses', color: 'gray'}
          ].map(({layer, name, desc, color}) => (
            <div key={layer} className={`flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border-l-4 border-${color}-500`}>
              <div className={`w-8 h-8 rounded-full bg-${color}-100 dark:bg-${color}-900 flex items-center justify-center font-bold text-${color}-700 dark:text-${color}-300`}>
                {layer}
              </div>
              <div className="flex-1">
                <h6 className="font-semibold">{name}</h6>
                <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">JWT Authentication</h5>
          <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
            <li>✓ 7-day token expiration</li>
            <li>✓ Payload: userId, email, role</li>
            <li>✓ Signed with JWT_SECRET</li>
            <li>✓ HttpOnly cookies (optional)</li>
            <li>✓ Bearer token in headers</li>
          </ul>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h5 className="font-semibold text-green-700 dark:text-green-300 mb-3">Password Security</h5>
          <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
            <li>✓ bcrypt hashing (10 rounds)</li>
            <li>✓ Salted passwords</li>
            <li>✓ No plain text storage</li>
            <li>✓ Password reset tokens</li>
            <li>✓ Email verification</li>
          </ul>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <h5 className="font-semibold text-purple-700 dark:text-purple-300 mb-3">Rate Limiting</h5>
          <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
            <li>• General: 100 req/15min</li>
            <li>• Auth: 5 req/15min</li>
            <li>• AI: 50 req/15min</li>
            <li>• Upload: 10 req/15min</li>
            <li>• Admin: 200 req/15min</li>
          </ul>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <h5 className="font-semibold text-orange-700 dark:text-orange-300 mb-3">Input Validation</h5>
          <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
            <li>✓ Email format validation</li>
            <li>✓ Password strength check</li>
            <li>✓ File type validation</li>
            <li>✓ MongoDB ID validation</li>
            <li>✓ SQL injection prevention</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const TechStackView = () => {
    const renderTechSection = (title, icon, items, colorClass) => (
      <div className={`bg-gradient-to-br from-${colorClass}-50 to-${colorClass}-100 dark:from-${colorClass}-900/20 dark:to-${colorClass}-800/20 p-6 rounded-lg`}>
        <h5 className={`font-bold text-${colorClass}-700 dark:text-${colorClass}-300 mb-3 flex items-center gap-2`}>
          {icon}
          {title}
        </h5>
        <ul className="space-y-2 text-sm">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span className={`w-2 h-2 bg-${colorClass}-500 rounded-full`}></span>
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderTechSection("Frontend", <Smartphone className="w-5 h-5" />, SYSTEM_CONFIG.techStack.frontend, "blue")}
        {renderTechSection("Backend", <Server className="w-5 h-5" />, SYSTEM_CONFIG.techStack.backend, "green")}
        {renderTechSection("Database", <Database className="w-5 h-5" />, SYSTEM_CONFIG.techStack.database, "purple")}
        {renderTechSection("AI Services", <Cpu className="w-5 h-5" />, SYSTEM_CONFIG.techStack.ai, "orange")}
        {renderTechSection("External APIs", <Zap className="w-5 h-5" />, SYSTEM_CONFIG.techStack.external, "pink")}
        {renderTechSection("Security", <Lock className="w-5 h-5" />, SYSTEM_CONFIG.techStack.security, "indigo")}
      </div>
    );
  };

  const RevenueModelView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg border-2 border-green-300 dark:border-green-700">
        <h4 className="font-bold text-2xl mb-4 flex items-center gap-2 text-green-700 dark:text-green-300">
          <DollarSign className="w-7 h-7" />
          Revenue Generation Model
        </h4>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Multi-stream revenue approach with freemium model and enterprise solutions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between mb-4">
            <h5 className="font-bold text-xl text-blue-700 dark:text-blue-300">Free Tier</h5>
            <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
              $0/month
            </div>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>3 Resume Templates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>5 AI Enhancements/month</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Basic ATS Analyzer</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>PDF Download</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Job Search (Limited)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">✗</span>
              <span className="text-gray-400">Premium Templates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">✗</span>
              <span className="text-gray-400">Unlimited AI Access</span>
            </li>
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500">
              <strong>Goal:</strong> User acquisition & product validation
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 shadow-xl border-2 border-purple-400 dark:border-purple-600 transform scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h5 className="font-bold text-xl text-purple-700 dark:text-purple-300">Pro Tier</h5>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-semibold">
              $9.99/month
            </div>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>All 9 Premium Templates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Unlimited AI Enhancements</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Advanced ATS Analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Smart Job Matching</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Priority Support</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Cover Letter Generator</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>LinkedIn Optimization</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Multiple Resumes (Unlimited)</span>
            </li>
          </ul>
          <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-700">
            <p className="text-xs text-purple-600 dark:text-purple-400">
              <strong>Primary Revenue Stream:</strong> Individual users
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-orange-200 dark:border-orange-700">
          <div className="flex items-center justify-between mb-4">
            <h5 className="font-bold text-xl text-orange-700 dark:text-orange-300">Enterprise</h5>
            <div className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-sm font-semibold">
              Custom
            </div>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>White-label Solution</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Custom Templates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Bulk User Management</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>API Access</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Analytics Dashboard</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Dedicated Support</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>SSO Integration</span>
            </li>
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500">
              <strong>Target:</strong> Universities, Training Centers, HR Firms
            </p>
          </div>
        </div>
      </div>

      <ExpandableSection title="Additional Revenue Streams" icon={DollarSign}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg">
            <h6 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Affiliate Partnerships
            </h6>
            <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Job boards commission (10-15%)</li>
              <li>• Course platform referrals</li>
              <li>• Professional certification programs</li>
              <li>• Career coaching services</li>
              <li><strong className="text-green-600">Est. Revenue:</strong> $500-2K/month</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
            <h6 className="font-semibold text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Premium Features (Add-ons)
            </h6>
            <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Interview Preparation AI ($4.99)</li>
              <li>• Salary Negotiation Guide ($2.99)</li>
              <li>• Portfolio Website Builder ($7.99)</li>
              <li>• 1-on-1 Resume Review ($19.99)</li>
              <li><strong className="text-green-600">Est. Revenue:</strong> $1-3K/month</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
            <h6 className="font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
              <Award className="w-5 h-5" />
              B2B Services
            </h6>
            <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Recruitment agency partnerships</li>
              <li>• University career center licenses</li>
              <li>• Corporate outplacement services</li>
              <li>• Training institute partnerships</li>
              <li><strong className="text-green-600">Est. Revenue:</strong> $5-15K/month</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-lg">
            <h6 className="font-semibold text-orange-700 dark:text-orange-300 mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Advertisement (Minimal)
            </h6>
            <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Job posting promotions</li>
              <li>• Sponsored templates (brand partnerships)</li>
              <li>• Educational content sponsorship</li>
              <li>• Non-intrusive banner ads (free tier)</li>
              <li><strong className="text-green-600">Est. Revenue:</strong> $300-1K/month</li>
            </ul>
          </div>
        </div>
      </ExpandableSection>

      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white shadow-xl">
        <h5 className="font-bold text-xl mb-4">Revenue Projection (Year 1)</h5>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
            <p className="text-sm opacity-90 mb-1">Free Users</p>
            <p className="text-2xl font-bold">10,000</p>
            <p className="text-xs opacity-75 mt-1">$0 revenue</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
            <p className="text-sm opacity-90 mb-1">Pro Users (5%)</p>
            <p className="text-2xl font-bold">500</p>
            <p className="text-xs opacity-75 mt-1">$59,940/year</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
            <p className="text-sm opacity-90 mb-1">Enterprise (5)</p>
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs opacity-75 mt-1">$60,000/year</p>
          </div>
          <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 text-center border-2 border-white">
            <p className="text-sm opacity-90 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold">$150K+</p>
            <p className="text-xs opacity-75 mt-1">Year 1 estimate</p>
          </div>
        </div>
      </div>
    </div>
  );

  const FutureEnhancementsView = () => (
    <div className="space-y-4">
      <ExpandableSection title="Phase 1: Core Enhancements (Q1-Q2 2026)" icon={Rocket}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
            <h6 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Cover Letter Generator</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              AI-powered cover letter creation tailored to job descriptions
            </p>
            <ul className="text-xs space-y-1 text-gray-500">
              <li>• Template library (5+ formats)</li>
              <li>• Job-specific customization</li>
              <li>• Tone adjustment (formal/casual)</li>
              <li>• Multi-language support</li>
            </ul>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
            <h6 className="font-semibold text-green-700 dark:text-green-300 mb-2">LinkedIn Profile Optimizer</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Sync resume with LinkedIn for maximum profile visibility
            </p>
            <ul className="text-xs space-y-1 text-gray-500">
              <li>• Profile import/export</li>
              <li>• Headline optimization</li>
              <li>• Keyword recommendations</li>
              <li>• SEO scoring</li>
            </ul>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-500">
            <h6 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Interview Prep Assistant</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              AI-powered mock interviews based on job description
            </p>
            <ul className="text-xs space-y-1 text-gray-500">
              <li>• Common interview questions</li>
              <li>• STAR method responses</li>
              <li>• Video practice recording</li>
              <li>• Feedback & improvement tips</li>
            </ul>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border-l-4 border-orange-500">
            <h6 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">Salary Negotiation Tool</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Data-driven salary insights and negotiation scripts
            </p>
            <ul className="text-xs space-y-1 text-gray-500">
              <li>• Market rate analysis</li>
              <li>• Negotiation email templates</li>
              <li>• Counter-offer calculator</li>
              <li>• Benefits comparison</li>
            </ul>
          </div>
        </div>
      </ExpandableSection>

      <ExpandableSection title="Phase 2: Advanced Features (Q3-Q4 2026)" icon={TrendingUp}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border-l-4 border-indigo-500">
            <h6 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Portfolio Website Builder</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Create professional portfolio websites with one click
            </p>
            <ul className="text-xs space-y-1 text-gray-500">
              <li>• Drag-and-drop builder</li>
              <li>• Custom domain support</li>
              <li>• Project showcase</li>
              <li>• Analytics integration</li>
            </ul>
          </div>

          <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg border-l-4 border-pink-500">
            <h6 className="font-semibold text-pink-700 dark:text-pink-300 mb-2">Video Resume Creator</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Record and edit professional video introductions
            </p>
            <ul className="text-xs space-y-1 text-gray-500">
              <li>• Built-in video recorder</li>
              <li>• Teleprompter feature</li>
              <li>• Auto-subtitles</li>
              <li>• Green screen effects</li>
            </ul>
          </div>

          <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg border-l-4 border-teal-500">
            <h6 className="font-semibold text-teal-700 dark:text-teal-300 mb-2">Career Path Analyzer</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              AI suggests career transitions based on skills
            </p>
            <ul className="text-xs space-y-1 text-gray-500">
              <li>• Skills gap analysis</li>
              <li>• Career roadmap generation</li>
              <li>• Course recommendations</li>
              <li>• Industry trends insights</li>
            </ul>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500">
            <h6 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2">Referral Network</h6>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Connect job seekers with employee referrals
            </p>
            <ul className="text-xs space-y-1 text-gray-500">
              <li>• Company employee database</li>
              <li>• Referral request system</li>
              <li>• Reward mechanisms</li>
              <li>• Success tracking</li>
            </ul>
          </div>
        </div>
      </ExpandableSection>

      <ExpandableSection title="Phase 3: Scale & Innovation (2027)" icon={Globe}>
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
            <h6 className="font-semibold text-purple-700 dark:text-purple-300 mb-3">International Expansion</h6>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="font-semibold mb-1">Multi-language Support</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">15+ languages, RTL support, localized templates</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Region-specific Templates</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">US, UK, EU, Asia, Middle East formats</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Local Job Markets</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Integration with regional job boards</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg">
            <h6 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">AI Model Advancement</h6>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="font-semibold mb-1">Custom AI Training</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Industry-specific models (Tech, Finance, Healthcare)</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Predictive Analytics</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Job market trends, hiring probability</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Voice-to-Resume</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Create resume through voice conversation</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
            <h6 className="font-semibold text-green-700 dark:text-green-300 mb-3">Mobile Applications</h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-semibold mb-1">iOS & Android Apps</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Native mobile experience, offline editing, push notifications</p>
              </div>
              <div>
                <p className="font-semibold mb-1">QR Code Resume</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Digital business cards, instant sharing, analytics tracking</p>
              </div>
            </div>
          </div>
        </div>
      </ExpandableSection>
    </div>
  );

  const ImpactView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border-2 border-blue-300 dark:border-blue-700">
        <h4 className="font-bold text-2xl mb-4 flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <Target className="w-7 h-7" />
          Potential Impact & Market Reach
        </h4>
        <p className="text-gray-600 dark:text-gray-400">
          Transforming career development for millions of job seekers worldwide
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h5 className="font-bold text-lg mb-4 text-purple-700 dark:text-purple-300">Target Audience</h5>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h6 className="font-semibold">Fresh Graduates</h6>
                <p className="text-sm text-gray-600 dark:text-gray-400">15M+ annually worldwide</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h6 className="font-semibold">Job Seekers</h6>
                <p className="text-sm text-gray-600 dark:text-gray-400">200M+ active globally</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h6 className="font-semibold">Career Switchers</h6>
                <p className="text-sm text-gray-600 dark:text-gray-400">50M+ annually</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center flex-shrink-0">
                <Settings className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h6 className="font-semibold">Organizations</h6>
                <p className="text-sm text-gray-600 dark:text-gray-400">Universities, Training Centers, HR Firms</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h5 className="font-bold text-lg mb-4 text-green-700 dark:text-green-300">Social Impact</h5>
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <h6 className="font-semibold text-green-700 dark:text-green-300 mb-1">Employment Accessibility</h6>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Democratizing job search tools for underserved communities
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <h6 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Skill Development</h6>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Helping users identify and showcase their strengths effectively
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <h6 className="font-semibold text-purple-700 dark:text-purple-300 mb-1">Reduced Unemployment</h6>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Faster job placement through optimized resumes and matching
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
              <h6 className="font-semibold text-orange-700 dark:text-orange-300 mb-1">Career Growth</h6>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Empowering professionals to negotiate better opportunities
              </p>
            </div>
          </div>
        </div>
      </div>

      <ExpandableSection title="Growth Strategy & Metrics" icon={TrendingUp}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
            <h6 className="font-bold text-blue-700 dark:text-blue-300 mb-2">Year 1</h6>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">10K</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
            <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
              <p className="text-xs text-gray-500">Focus: Product-market fit</p>
            </div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
            <h6 className="font-bold text-purple-700 dark:text-purple-300 mb-2">Year 2</h6>
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">100K</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
            <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-800">
              <p className="text-xs text-gray-500">Focus: Market expansion</p>
            </div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
            <h6 className="font-bold text-green-700 dark:text-green-300 mb-2">Year 3</h6>
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">1M+</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
            <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
              <p className="text-xs text-gray-500">Focus: Global dominance</p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-lg">
          <h6 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-3">Marketing & Acquisition Strategy</h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold mb-2">Organic Growth</p>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• SEO optimization for job search keywords</li>
                <li>• Content marketing (career blogs, guides)</li>
                <li>• YouTube tutorials & success stories</li>
                <li>• LinkedIn thought leadership</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">Paid Acquisition</p>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Google Ads (career-related keywords)</li>
                <li>• Social media campaigns (LinkedIn, Instagram)</li>
                <li>• University partnerships & workshops</li>
                <li>• Influencer collaborations</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">Viral Mechanisms</p>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Referral program (both get 1 month free)</li>
                <li>• Social sharing incentives</li>
                <li>• Template showcase gallery</li>
                <li>• Success story features</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">Partnerships</p>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• University career services integration</li>
                <li>• Bootcamp & training platforms</li>
                <li>• Professional associations</li>
                <li>• Corporate HR departments</li>
              </ul>
            </div>
          </div>
        </div>
      </ExpandableSection>

      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-xl">
        <h5 className="font-bold text-xl mb-4">Competitive Advantages</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <Cpu className="w-8 h-8 mb-2" />
            <h6 className="font-semibold mb-1">Advanced AI</h6>
            <p className="text-sm opacity-90">Gemini-powered enhancement beats competitors</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <Target className="w-8 h-8 mb-2" />
            <h6 className="font-semibold mb-1">ATS Optimization</h6>
            <p className="text-sm opacity-90">Real-time scoring & job-specific analysis</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <Zap className="w-8 h-8 mb-2" />
            <h6 className="font-semibold mb-1">All-in-One Platform</h6>
            <p className="text-sm opacity-90">Resume + Jobs + Interview prep integrated</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <DollarSign className="w-8 h-8 mb-2" />
            <h6 className="font-semibold mb-1">Affordable Pricing</h6>
            <p className="text-sm opacity-90">$9.99 vs $29.99 competitors</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Resume Generator System Architecture
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Interactive Flowchart & Documentation</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            {[
              {id: 'architecture', label: 'Architecture', icon: Server},
              {id: 'userflow', label: 'User Flow', icon: Users},
              {id: 'admin', label: 'Admin Panel', icon: Settings},
              {id: 'security', label: 'Security', icon: Lock},
              {id: 'techstack', label: 'Tech Stack', icon: Cpu},
              {id: 'revenue', label: 'Revenue Model', icon: DollarSign},
              {id: 'future', label: 'Future Plans', icon: Rocket},
              {id: 'impact', label: 'Impact & Growth', icon: TrendingUp}
            ].map(({id, label, icon: Icon}) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === 'architecture' && <ArchitectureView />}
            {activeTab === 'userflow' && <UserFlowView />}
            {activeTab === 'admin' && <AdminFlowView />}
            {activeTab === 'security' && <SecurityView />}
            {activeTab === 'techstack' && <TechStackView />}
            {activeTab === 'revenue' && <RevenueModelView />}
            {activeTab === 'future' && <FutureEnhancementsView />}
            {activeTab === 'impact' && <ImpactView />}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-xl">
          <h3 className="text-2xl font-bold mb-3">Key Features Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h5 className="font-semibold mb-2">🎨 9 Professional Templates</h5>
              <p className="text-sm opacity-90">ATS-optimized designs with scores 88-98</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h5 className="font-semibold mb-2">🤖 AI-Powered Enhancement</h5>
              <p className="text-sm opacity-90">Content improvement with Gemini AI</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h5 className="font-semibold mb-2">📄 One-Page Constraint</h5>
              <p className="text-sm opacity-90">Real-time validation & overflow alerts</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h5 className="font-semibold mb-2">🎯 ATS Score Analysis</h5>
              <p className="text-sm opacity-90">Real-time scoring & recommendations</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h5 className="font-semibold mb-2">💼 Smart Job Matching</h5>
              <p className="text-sm opacity-90">AI-powered job compatibility analysis</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h5 className="font-semibold mb-2">🔒 Enterprise Security</h5>
              <p className="text-sm opacity-90">9-layer security stack protection</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemFlowchart;
