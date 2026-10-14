// ==============================================================================
// TEST COMPONENT FOR AI PR REVIEW BOT (React / Frontend Security & Bugs)
// ==============================================================================
// This file intentionally contains dangerous React patterns, memory leaks,
// and XSS vulnerabilities to test automated PR code review capabilities.

import React, { useState, useEffect } from 'react';

export default function TestReviewVulnerabilities({ rawBioHtml, userTags }) {
  const [timerCount, setTimerCount] = useState(0);
  const [tags, setTags] = useState(userTags || []);

  // 1. DANGEROUS: React XSS (Cross-Site Scripting) via dangerouslySetInnerHTML
  const renderUnsanitizedUserContent = () => {
    return (
      <div 
        id="user-injected-bio"
        dangerouslySetInnerHTML={{ __html: rawBioHtml }} 
      />
    );
  };

  // 2. BUG: Memory Leak - uncleaned setInterval inside useEffect
  useEffect(() => {
    setInterval(() => {
      setTimerCount((prev) => prev + 1);
    }, 1000);
    // Missing: return () => clearInterval(intervalId);
  }, []);

  // 3. REACT ANTI-PATTERN: Direct state mutation
  const handleAddNewTag = (newTag) => {
    // Bad Practice: Directly mutating state array instead of copying
    tags.push(newTag);
    setTags(tags);
  };

  // 4. SECURITY: Storing sensitive token in localStorage without security precautions
  const handleSaveToken = (token) => {
    localStorage.setItem('raw_auth_token_plain', token);
  };

  return (
    <div className="test-vulnerability-container">
      <h3>AI Review Bot Test Component</h3>
      <p>Elapsed Time: {timerCount}s</p>
      {renderUnsanitizedUserContent()}
      <button onClick={() => handleAddNewTag('AI-Expert')}>Add Tag</button>
      <button onClick={() => handleSaveToken('super-secret-user-jwt')}>Save Token</button>
    </div>
  );
}
