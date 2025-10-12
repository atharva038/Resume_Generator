import {Link} from "react-router-dom";

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Build an ATS-Friendly Resume with AI
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Upload your resume and let AI transform it into an optimized,
          ATS-compatible document that gets you noticed by recruiters.
        </p>

        <div className="flex justify-center gap-4 mb-16">
          <Link to="/upload" className="btn-primary text-lg px-8 py-3">
            Get Started
          </Link>
          <a href="#features" className="btn-secondary text-lg px-8 py-3">
            Learn More
          </a>
        </div>

        <div id="features" className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="card p-6">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">
              Smart Upload
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Upload PDF or DOCX files. Our AI extracts and structures your
              resume content automatically.
            </p>
          </div>

          <div className="card p-6">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">
              AI Enhancement
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Powered by Gemini AI to rewrite bullets with action verbs,
              metrics, and ATS keywords.
            </p>
          </div>

          <div className="card p-6">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">
              ATS Optimized
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Export text-based PDFs that pass through Applicant Tracking
              Systems seamlessly.
            </p>
          </div>
        </div>

        <div className="mt-16 card p-8">
          <h2 className="text-3xl font-bold mb-4 dark:text-gray-100">
            Why ATS Optimization Matters
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            Over 90% of large companies use Applicant Tracking Systems (ATS) to
            filter resumes. If your resume isn't optimized, it may never reach
            human eyes.
          </p>
          <ul className="text-left max-w-2xl mx-auto space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-primary-600 dark:text-primary-400 mr-2">
                ✓
              </span>
              <span>
                Clean, single-column layout that ATS can parse correctly
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 dark:text-primary-400 mr-2">
                ✓
              </span>
              <span>
                Action-verb-first bullets with quantifiable achievements
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 dark:text-primary-400 mr-2">
                ✓
              </span>
              <span>
                Industry-standard keywords relevant to your target role
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 dark:text-primary-400 mr-2">
                ✓
              </span>
              <span>Text-based PDF format (not image-based)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
