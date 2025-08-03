// // app/components/ResumeForm.tsx
// "use client";

// // ResumeForm component for uploading a resume (PDF or text) and job description.
// // Submits data to the /api/analyze route for processing.

// import React, { useState } from "react";

// const ResumeForm: React.FC = () => {
//   const [resumeFile, setResumeFile] = useState<File | null>(null);
//   const [jobDescription, setJobDescription] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!resumeFile && !jobDescription.trim()) {
//       setError("Please upload a resume or enter a job description.");
//       return;
//     }

//     setIsLoading(true);
//     setError("");

//     try {
//       const formData = new FormData();
//       if (resumeFile) formData.append("resume", resumeFile);
//       formData.append("jobDescription", jobDescription);

//       const response = await fetch("/api/analyze", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error("Analysis failed");
//       }

//       const data = await response.json();
//       // Redirect to results page with analysis data (client-side navigation)
//       window.location.href = `/results?data=${encodeURIComponent(JSON.stringify(data))}`;
//     } catch (err) {
//       setError("Failed to analyze resume. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Resume Analyzer</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
//             Upload Resume (PDF)
//           </label>
//           <input
//             type="file"
//             id="resume"
//             accept=".pdf"
//             onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
//             className="mt-1 block w-full border rounded p-2"
//           />
//         </div>
//         <div>
//           <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
//             Job Description
//           </label>
//           <textarea
//             id="jobDescription"
//             value={jobDescription}
//             onChange={(e) => setJobDescription(e.target.value)}
//             className="mt-1 block w-full border rounded p-2"
//             rows={4}
//             placeholder="Paste the job description here..."
//           />
//         </div>
//         {error && <p className="text-red-500">{error}</p>}
//         <button
//           type="submit"
//           disabled={isLoading}
//           className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
//         >
//           {isLoading ? "Analyzing..." : "Analyze Resume"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ResumeForm;


'use client'

import React, { useState } from "react";
import { Upload, FileText, Briefcase, Zap, CheckCircle, AlertCircle, Loader2, Target, User, LogOut } from 'lucide-react';
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';

const ResumeForm: React.FC = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is signed in
    if (!isSignedIn) {
      setError("Please sign in to analyze your resume.");
      return;
    }
    
    if (!resumeFile && !jobDescription.trim()) {
      setError("Please upload a resume or enter a job description.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      if (resumeFile) formData.append("resume", resumeFile);
      formData.append("jobDescription", jobDescription);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      // Redirect to results page with analysis data (client-side navigation)
      window.location.href = `/results?data=${encodeURIComponent(JSON.stringify(data))}`;
    } catch (err) {
      setError("Failed to analyze resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Resume Analyzer
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {!isLoaded ? (
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              ) : isSignedIn ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                    </span>
                  </div>
                  <SignOutButton>
                    <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Sign Out</span>
                    </button>
                  </SignOutButton>
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Sign In</span>
                  </button>
                </SignInButton>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg">
              <Zap className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Resume Analyzer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Get instant insights on your resume's performance with AI-powered analysis. 
            Optimize for ATS systems and improve your job match score.
          </p>
        </div>

        {/* Main Form Container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <FileText className="w-7 h-7" />
                Upload & Analyze
              </h2>
              <p className="text-blue-100 mt-2">Upload your resume and job description to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Resume Upload Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Upload className="w-5 h-5 text-blue-600" />
                    </div>
                    <label htmlFor="resume" className="text-lg font-semibold text-gray-800">
                      Upload Resume
                    </label>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="file"
                      id="resume"
                      accept=".pdf"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label
                      htmlFor="resume"
                      className={`
                        flex flex-col items-center justify-center w-full h-48 
                        border-2 border-dashed rounded-xl cursor-pointer 
                        transition-all duration-300 hover:bg-gray-50
                        ${resumeFile 
                          ? 'border-green-400 bg-green-50' 
                          : 'border-gray-300 hover:border-blue-400'
                        }
                      `}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {resumeFile ? (
                          <>
                            <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
                            <p className="text-green-700 font-medium">{resumeFile.name}</p>
                            <p className="text-sm text-green-600">
                              {(resumeFile.size / 1024 / 1024).toFixed(2)} MB • PDF
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-12 h-12 text-gray-400 mb-3" />
                            <p className="mb-2 text-lg font-medium text-gray-700">
                              Drop your PDF here
                            </p>
                            <p className="text-sm text-gray-500">or click to browse</p>
                          </>
                        )}
                      </div>
                    </label>
                  </div>

                  {resumeFile && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-green-800 text-sm font-medium">Resume uploaded successfully!</span>
                    </div>
                  )}
                </div>

                {/* Job Description Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Briefcase className="w-5 h-5 text-indigo-600" />
                    </div>
                    <label htmlFor="jobDescription" className="text-lg font-semibold text-gray-800">
                      Job Description
                    </label>
                  </div>
                  
                  <div className="relative">
                    <textarea
                      id="jobDescription"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="w-full h-48 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                      placeholder="Paste the complete job description here...

Example:
• Bachelor's degree in Computer Science
• 3+ years of experience with React and Node.js
• Strong knowledge of JavaScript, TypeScript
• Experience with AWS, Docker, and CI/CD
• Excellent communication skills"
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                      {jobDescription.length} characters
                    </div>
                  </div>

                  {jobDescription.trim() && (
                    <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                      <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                      <span className="text-indigo-800 text-sm font-medium">
                        Job description added • {jobDescription.trim().split(' ').length} words
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-8 flex justify-center">
                {!isSignedIn ? (
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className="flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    >
                      <User className="w-6 h-6" />
                      Sign In to Analyze Resume
                    </button>
                  </SignInButton>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`
                      flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg
                      transition-all duration-300 transform hover:scale-105 
                      focus:outline-none focus:ring-4 focus:ring-blue-300
                      ${isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
                      }
                    `}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Analyzing Your Resume...
                      </>
                    ) : (
                      <>
                        <Zap className="w-6 h-6" />
                        Analyze Resume
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Progress Indicator */}
              {isLoading && (
                <div className="mt-6">
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-center text-gray-600 mt-2 text-sm">
                    Processing your resume and job description...
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Features Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">ATS Optimization</h3>
              <p className="text-gray-600 text-sm">Ensure your resume passes Applicant Tracking Systems</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Keyword Matching</h3>
              <p className="text-gray-600 text-sm">Identify missing keywords and improve job relevance</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-4">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Readability Score</h3>
              <p className="text-gray-600 text-sm">Get professional feedback on writing quality</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;