
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** ATS_RESUME_GENERATOR
- **Date:** 2025-11-11
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001
- **Test Name:** User Registration with Email and Password
- **Test Code:** [TC001_User_Registration_with_Email_and_Password.py](./TC001_User_Registration_with_Email_and_Password.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/0d8decf7-6bb0-4818-8ea2-148e415cf5db
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002
- **Test Name:** User Login via Email and Password
- **Test Code:** [TC002_User_Login_via_Email_and_Password.py](./TC002_User_Login_via_Email_and_Password.py)
- **Test Error:** Login test could not be completed due to persistent network error preventing successful authentication despite correct credentials. Please resolve network issues to proceed with login verification.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=f23c9a08:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5000/api/auth/login:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5000/api/auth/login:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/7c8ce381-d27e-41fc-beb0-dedab6c7970b
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003
- **Test Name:** User Login Failure with Incorrect Password
- **Test Code:** [TC003_User_Login_Failure_with_Incorrect_Password.py](./TC003_User_Login_Failure_with_Incorrect_Password.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/0eee97d7-f41a-4ed1-9d23-5f75f306e901
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004
- **Test Name:** OAuth Login with Google
- **Test Code:** [TC004_OAuth_Login_with_Google.py](./TC004_OAuth_Login_with_Google.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/f2da348d-801e-4bb9-bd88-377d6b131cf2
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005
- **Test Name:** OAuth Login with GitHub
- **Test Code:** [TC005_OAuth_Login_with_GitHub.py](./TC005_OAuth_Login_with_GitHub.py)
- **Test Error:** The GitHub OAuth login flow is broken. Clicking the 'Continue with GitHub' button leads to a blank chrome error page, preventing further login and dashboard access testing. Reporting this issue and stopping the test as requested.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/src/App.jsx:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/587f18b3-0b1d-4c5a-955c-443c47099c0a
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006
- **Test Name:** Password Reset - Request Email
- **Test Code:** [TC006_Password_Reset___Request_Email.py](./TC006_Password_Reset___Request_Email.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/e2986848-cb89-4d75-bd41-448f6b6a5a14
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007
- **Test Name:** Password Reset - Invalid Email Submission
- **Test Code:** [TC007_Password_Reset___Invalid_Email_Submission.py](./TC007_Password_Reset___Invalid_Email_Submission.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/655d6f85-a871-4d70-883c-88b5151370f4
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008
- **Test Name:** Resume Upload - Valid PDF File Under Size Limit
- **Test Code:** [TC008_Resume_Upload___Valid_PDF_File_Under_Size_Limit.py](./TC008_Resume_Upload___Valid_PDF_File_Under_Size_Limit.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/43c4cd16-ff59-42b7-8e06-91ef8608c805
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009
- **Test Name:** Resume Upload - Valid DOCX File Under Size Limit
- **Test Code:** [TC009_Resume_Upload___Valid_DOCX_File_Under_Size_Limit.py](./TC009_Resume_Upload___Valid_DOCX_File_Under_Size_Limit.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/a88b5b56-dc97-4f93-8942-902db99f07b5
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010
- **Test Name:** Resume Upload - Reject Unsupported File Types
- **Test Code:** [TC010_Resume_Upload___Reject_Unsupported_File_Types.py](./TC010_Resume_Upload___Reject_Unsupported_File_Types.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/dc73a619-272c-4456-83fb-cdaef803b975
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011
- **Test Name:** Resume Upload - Reject Oversized Files
- **Test Code:** [TC011_Resume_Upload___Reject_Oversized_Files.py](./TC011_Resume_Upload___Reject_Oversized_Files.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/bca183b5-cea9-4d73-ac03-cc1caf677931
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012
- **Test Name:** AI Parsing Accuracy and Structured Resume Generation
- **Test Code:** [TC012_AI_Parsing_Accuracy_and_Structured_Resume_Generation.py](./TC012_AI_Parsing_Accuracy_and_Structured_Resume_Generation.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/36fb382d-3729-438e-982a-b7b44345e34c
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013
- **Test Name:** Rich Text Editor Functionality - Edit Sections
- **Test Code:** [TC013_Rich_Text_Editor_Functionality___Edit_Sections.py](./TC013_Rich_Text_Editor_Functionality___Edit_Sections.py)
- **Test Error:** Unable to proceed with testing resume editing due to persistent network error blocking login. The network error prevents access to the dashboard and resume editor, so editing resume sections cannot be verified. Recommend resolving network connectivity or server issues to continue testing.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/src/App.jsx:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5000/api/auth/login:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5000/api/auth/login:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/96b9d44b-e095-490d-a315-1039b6cae5ca
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014
- **Test Name:** Rich Text Editor - Drag and Drop Section Reordering
- **Test Code:** [TC014_Rich_Text_Editor___Drag_and_Drop_Section_Reordering.py](./TC014_Rich_Text_Editor___Drag_and_Drop_Section_Reordering.py)
- **Test Error:** The login attempts to the SmartNShine ATS Resume Builder failed repeatedly due to a persistent network error message indicating connection issues. Because of this, I could not authenticate and access the resume builder to test the drag-and-drop functionality for resume sections. Please check the network connection or backend service availability and try again later.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5173/src/App.jsx:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5000/api/auth/login:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5000/api/auth/login:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5000/api/auth/login:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/4cfe1d31-33db-421c-bb00-ea41517c917f
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC015
- **Test Name:** AI Enhancements in Editor
- **Test Code:** [TC015_AI_Enhancements_in_Editor.py](./TC015_AI_Enhancements_in_Editor.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/562b5c4d-b70a-4938-9694-3792a13b390e
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC016
- **Test Name:** Resume Save and Persistence
- **Test Code:** [TC016_Resume_Save_and_Persistence.py](./TC016_Resume_Save_and_Persistence.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/e52ae104-928d-4b3e-88be-2b084f179a8f
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC017
- **Test Name:** Resume Delete Functionality
- **Test Code:** [TC017_Resume_Delete_Functionality.py](./TC017_Resume_Delete_Functionality.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/e93b06aa-49e0-4eea-b80c-110a1358f5a2
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC018
- **Test Name:** Template Selection and Customization
- **Test Code:** [TC018_Template_Selection_and_Customization.py](./TC018_Template_Selection_and_Customization.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/b8407fee-d862-42ec-be58-77e9554644e4
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC019
- **Test Name:** ATS Analyzer - Score Calculation and Keyword Matching
- **Test Code:** [TC019_ATS_Analyzer___Score_Calculation_and_Keyword_Matching.py](./TC019_ATS_Analyzer___Score_Calculation_and_Keyword_Matching.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/2f4eab82-30c0-40a0-baa4-a740ea0a9e85
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC020
- **Test Name:** ATS Analyzer - Handle Incomplete or Malformed Job Descriptions
- **Test Code:** [TC020_ATS_Analyzer___Handle_Incomplete_or_Malformed_Job_Descriptions.py](./TC020_ATS_Analyzer___Handle_Incomplete_or_Malformed_Job_Descriptions.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/de0e13a2-3729-402c-8fb0-8e2dee15ad1c
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC021
- **Test Name:** Machine Learning Job Matching - Compatibility Scoring
- **Test Code:** [TC021_Machine_Learning_Job_Matching___Compatibility_Scoring.py](./TC021_Machine_Learning_Job_Matching___Compatibility_Scoring.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/e296a48e-5f8c-4efb-8bc9-88bfad617036
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC022
- **Test Name:** GitHub OAuth Profile and Projects Import
- **Test Code:** [TC022_GitHub_OAuth_Profile_and_Projects_Import.py](./TC022_GitHub_OAuth_Profile_and_Projects_Import.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/ebdf52fa-4636-48f6-a3a4-88254279cbe8
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC023
- **Test Name:** User Dashboard - Resume Listing and Version Management
- **Test Code:** [TC023_User_Dashboard___Resume_Listing_and_Version_Management.py](./TC023_User_Dashboard___Resume_Listing_and_Version_Management.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/0d2f4959-7c13-41f3-b373-703ffc2466ea
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC024
- **Test Name:** Navigation Blocking on Unsaved Changes
- **Test Code:** [TC024_Navigation_Blocking_on_Unsaved_Changes.py](./TC024_Navigation_Blocking_on_Unsaved_Changes.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/a1ed3a23-5645-46c3-926c-356a765a0ee0
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC025
- **Test Name:** Admin Dashboard - Role-based Access Control
- **Test Code:** [TC025_Admin_Dashboard___Role_based_Access_Control.py](./TC025_Admin_Dashboard___Role_based_Access_Control.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/1294f790-04cc-4270-8440-92913ced8360
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC026
- **Test Name:** Admin Dashboard - User Management Functionality
- **Test Code:** [TC026_Admin_Dashboard___User_Management_Functionality.py](./TC026_Admin_Dashboard___User_Management_Functionality.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/1cfca3c1-812a-4103-a830-42c6c0805d2c
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC027
- **Test Name:** Admin Dashboard - Feedback and Contact Message Handling
- **Test Code:** [TC027_Admin_Dashboard___Feedback_and_Contact_Message_Handling.py](./TC027_Admin_Dashboard___Feedback_and_Contact_Message_Handling.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/1c6e76c6-c27e-45c0-abeb-5055e8b0a737
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC028
- **Test Name:** Contact Form Submission
- **Test Code:** [TC028_Contact_Form_Submission.py](./TC028_Contact_Form_Submission.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/b57ce87d-9266-47a5-9c23-d1c7c5e006a0
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC029
- **Test Name:** Feedback Submission Form
- **Test Code:** [TC029_Feedback_Submission_Form.py](./TC029_Feedback_Submission_Form.py)
- **Test Error:** 
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_CONTENT_LENGTH_MISMATCH (at http://localhost:5173/node_modules/.vite/deps/chunk-KDCVS43I.js?v=f23c9a08:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/6b4b3296-0d79-425b-bc9e-299c6d86ca56
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC030
- **Test Name:** Global Dark Mode Toggle and Persistence
- **Test Code:** [TC030_Global_Dark_Mode_Toggle_and_Persistence.py](./TC030_Global_Dark_Mode_Toggle_and_Persistence.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/f255eea2-dc29-434c-bb2e-a623b94f0a5f
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC031
- **Test Name:** Export Resume as ATS-Friendly PDF
- **Test Code:** [TC031_Export_Resume_as_ATS_Friendly_PDF.py](./TC031_Export_Resume_as_ATS_Friendly_PDF.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/32032e5d-2112-47a4-ab1f-f7e2a2b79cf4
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC032
- **Test Name:** API Rate Limiting Enforcement
- **Test Code:** [TC032_API_Rate_Limiting_Enforcement.py](./TC032_API_Rate_Limiting_Enforcement.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/60e9f4b8-df31-434d-927f-5ff1420f8cfe
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC033
- **Test Name:** JWT Token Expiration and Renewal Handling
- **Test Code:** [TC033_JWT_Token_Expiration_and_Renewal_Handling.py](./TC033_JWT_Token_Expiration_and_Renewal_Handling.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/afc2fc84-d59f-4be2-92f6-f4da60fff74d
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC034
- **Test Name:** Data Sanitization and XSS Protection
- **Test Code:** [TC034_Data_Sanitization_and_XSS_Protection.py](./TC034_Data_Sanitization_and_XSS_Protection.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/ae7b0ccc-83ea-48e7-a38e-7d2bece1ffd9
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC035
- **Test Name:** Responsive UI Layout Across Devices
- **Test Code:** [TC035_Responsive_UI_Layout_Across_Devices.py](./TC035_Responsive_UI_Layout_Across_Devices.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ffed7d6c-a91d-42e1-a5e6-072cf09ee265/2a2e6560-16d4-4cd2-a959-c4471659ac1e
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **0.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---