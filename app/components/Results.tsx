// // app/components/Results.tsx
// "use client";

// // Results component to display resume analysis (match score, keywords, ATS issues, etc.) using Tailwind CSS.

// import React from "react";

// interface AnalysisResult {
//   matchScore: number;
//   matchingKeywords: string[];
//   missingKeywords: string[];
//   atsIssues: string[];
//   actionVerbFeedback: Array<{ bullet: string; feedback: string }>;
//   readabilityScore: number;
//   grammarIssues: string[];
// }

// interface ResultsProps {
//   analysis: AnalysisResult;
// }

// const Results: React.FC<ResultsProps> = ({ analysis }) => {
//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Resume Analysis Results</h1>

//       {/* Match Score */}
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold">Job Description Match</h2>
//         <p className="text-lg">Match Score: <span className="font-bold">{analysis.matchScore}%</span></p>
//         <div className="mt-2">
//           <h3 className="text-md font-medium">Matching Keywords:</h3>
//           <ul className="list-disc pl-5">
//             {analysis.matchingKeywords.length ? (
//               analysis.matchingKeywords.map((keyword, index) => (
//                 <li key={index}>{keyword}</li>
//               ))
//             ) : (
//               <li>No matching keywords found.</li>
//             )}
//           </ul>
//         </div>
//         <div className="mt-2">
//           <h3 className="text-md font-medium">Missing Keywords:</h3>
//           <ul className="list-disc pl-5">
//             {analysis.missingKeywords.length ? (
//               analysis.missingKeywords.map((keyword, index) => (
//                 <li key={index}>{keyword}</li>
//               ))
//             ) : (
//               <li>No missing keywords.</li>
//             )}
//           </ul>
//         </div>
//       </div>

//       {/* ATS Friendliness */}
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold">ATS Friendliness</h2>
//         {analysis.atsIssues.length ? (
//           <ul className="list-disc pl-5 text-red-600">
//             {analysis.atsIssues.map((issue, index) => (
//               <li key={index}>{issue}</li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-green-600">No ATS issues detected.</p>
//         )}
//       </div>

//       {/* Action Verb Feedback */}
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold">Action Verb Analysis</h2>
//         {analysis.actionVerbFeedback.length ? (
//           <ul className="space-y-2">
//             {analysis.actionVerbFeedback.map((item, index) => (
//               <li key={index}>
//                 <p><strong>Bullet:</strong> {item.bullet}</p>
//                 <p><strong>Feedback:</strong> {item.feedback}</p>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No action verb feedback provided.</p>
//         )}
//       </div>

//       {/* Readability and Grammar */}
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold">Readability and Professionalism</h2>
//         <p>Readability Score (Flesch-Kincaid Grade Level): <span className="font-bold">{analysis.readabilityScore.toFixed(1)}</span></p>
//         <p className="text-sm text-gray-600">Lower scores indicate easier readability (aim for 8-10).</p>

//         <div className="mt-2">
//           <h3 className="text-md font-medium">Grammar Issues:</h3>
//           {analysis.grammarIssues.length ? (
//             <ul className="list-disc pl-5 text-red-600">
//               {analysis.grammarIssues.map((issue, index) => (
//                 <li key={index}>
//                   {typeof issue === 'object' && issue !== null
//                     ? `${(issue as { issue?: string }).issue || ''} ${(issue as { suggestion?: string }).suggestion ? `- Suggestion: ${(issue as { suggestion?: string }).suggestion}` : ''}`
//                     : issue}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-green-600">No grammar issues detected.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Results;




import React from "react";
import { CheckCircle, AlertTriangle, Target, FileText, TrendingUp, Users, Award, Zap } from 'lucide-react';

interface AnalysisResult {
  matchScore: number;
  matchingKeywords: string[];
  missingKeywords: string[];
  atsIssues: string[];
  actionVerbFeedback: Array<{ bullet: string; feedback: string }>;
  readabilityScore: number;
  grammarIssues: string[];
}

interface ResultsProps {
  analysis: AnalysisResult;
}

const Results: React.FC<ResultsProps> = ({ analysis }) => {
  // Helper function to get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Helper function to get score background
  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  // Helper function to get readability assessment
  const getReadabilityAssessment = (score: number) => {
    if (score <= 8) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (score <= 10) return { label: 'Good', color: 'text-green-600', bg: 'bg-green-50' };
    if (score <= 12) return { label: 'Acceptable', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { label: 'Complex', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const readabilityAssessment = getReadabilityAssessment(analysis.readabilityScore);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-500 rounded-full">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Resume Analysis Results</h1>
          <p className="text-lg text-gray-600">Comprehensive evaluation of your resume performance</p>
        </div>

        {/* Overall Score Hero Card */}
        <div className={`mb-8 p-8 rounded-2xl border-2 shadow-lg ${getScoreBg(analysis.matchScore)}`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Job Description Match</h2>
              </div>
              <p className="text-lg text-gray-700 mb-4">
                Your resume demonstrates a{' '}
                <span className="font-semibold">
                  {analysis.matchScore >= 80 ? 'strong' : analysis.matchScore >= 60 ? 'moderate' : 'weak'}
                </span>{' '}
                alignment with the target job description
              </p>
            </div>
            <div className="text-right">
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(analysis.matchScore)}`}>
                {analysis.matchScore}%
              </div>
              <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    analysis.matchScore >= 80 ? 'bg-green-500' : 
                    analysis.matchScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${analysis.matchScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Grid Layout for Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Keywords Analysis */}
          <div className="space-y-6">
            {/* Matching Keywords */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-800">Matching Keywords</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    {analysis.matchingKeywords.length}
                  </span>
                </div>
              </div>
              <div className="p-6">
                {analysis.matchingKeywords.length ? (
                  <div className="flex flex-wrap gap-2">
                    {analysis.matchingKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-200"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No matching keywords found.</p>
                )}
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-red-800">Missing Keywords</h3>
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                    {analysis.missingKeywords.length}
                  </span>
                </div>
              </div>
              <div className="p-6">
                {analysis.missingKeywords.length ? (
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium border border-red-200"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-green-600 font-medium">✓ No missing keywords - excellent coverage!</p>
                )}
              </div>
            </div>
          </div>

          {/* ATS & Technical Analysis */}
          <div className="space-y-6">
            {/* ATS Friendliness */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className={`px-6 py-4 border-b ${analysis.atsIssues.length ? 'bg-orange-50 border-orange-100' : 'bg-green-50 border-green-100'}`}>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">ATS Friendliness</h3>
                  <span className={`px-2 py-1 text-sm font-medium rounded-full ${
                    analysis.atsIssues.length ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {analysis.atsIssues.length ? `${analysis.atsIssues.length} Issues` : 'Optimized'}
                  </span>
                </div>
              </div>
              <div className="p-6">
                {analysis.atsIssues.length ? (
                  <div className="space-y-3">
                    {analysis.atsIssues.map((issue, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                        <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <p className="text-orange-800 text-sm">{issue}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <p className="font-medium">No ATS issues detected - your resume is ATS-optimized!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Readability Score */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className={`px-6 py-4 border-b ${readabilityAssessment.bg} border-gray-100`}>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Readability & Professionalism</h3>
                  <span className={`px-2 py-1 text-sm font-medium rounded-full ${readabilityAssessment.bg} ${readabilityAssessment.color} border`}>
                    {readabilityAssessment.label}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Flesch-Kincaid Grade Level</p>
                    <p className={`text-2xl font-bold ${readabilityAssessment.color}`}>
                      {analysis.readabilityScore.toFixed(1)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Target: 8-10</p>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          analysis.readabilityScore <= 10 ? 'bg-green-500' : 
                          analysis.readabilityScore <= 12 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, (10 / analysis.readabilityScore) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Lower scores indicate easier readability. Aim for 8-10 for professional documents.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Sections */}
        <div className="mt-8 space-y-8">
          {/* Grammar Issues */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className={`px-6 py-4 border-b ${analysis.grammarIssues.length ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-800">Grammar Analysis</h3>
                <span className={`px-2 py-1 text-sm font-medium rounded-full ${
                  analysis.grammarIssues.length ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {analysis.grammarIssues.length ? `${analysis.grammarIssues.length} Issues` : 'Clean'}
                </span>
              </div>
            </div>
            <div className="p-6">
              {analysis.grammarIssues.length ? (
                <div className="space-y-3">
                  {analysis.grammarIssues.map((issue, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-100">
                      <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-red-800 text-sm">
                        {typeof issue === 'object' && issue !== null
                          ? `${(issue as { issue?: string }).issue || ''} ${(issue as { suggestion?: string }).suggestion ? `- Suggestion: ${(issue as { suggestion?: string }).suggestion}` : ''}`
                          : issue}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <p className="font-medium">No grammar issues detected - your writing is clean and professional!</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Verb Feedback */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-800">Action Verb Analysis</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  {analysis.actionVerbFeedback.length} {analysis.actionVerbFeedback.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>
            </div>
            <div className="p-6">
              {analysis.actionVerbFeedback.length ? (
                <div className="space-y-4">
                  {analysis.actionVerbFeedback.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Original Bullet Point:</p>
                        <p className="text-gray-900 bg-gray-100 p-2 rounded italic">"{item.bullet}"</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-700 mb-1">💡 Improvement Suggestion:</p>
                        <p className="text-blue-800">{item.feedback}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No action verb feedback provided.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">Analysis Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;